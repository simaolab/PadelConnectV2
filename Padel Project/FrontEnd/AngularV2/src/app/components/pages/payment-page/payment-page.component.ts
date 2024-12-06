import { Court } from './../../../interfaces/court';
import { ReservationsService } from './../../../services/reservations.service';
import { UsersService } from './../../../services/users.service';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { PageTopComponent } from './../../utilities/page-top/page-top.component';
import { MainContentComponent } from '../../utilities/main-content/main-content.component';
import Swal from 'sweetalert2';
import { CookieService } from 'ngx-cookie-service';
import { CartItem, Cart } from '../../../interfaces/cart';
import { switchMap } from 'rxjs/operators';
import { ModalComponent } from '../../utilities/modal/modal.component';

@Component({
  selector: 'app-payment-page',
  standalone: true,
  imports: [
    CommonModule,
    PageTopComponent,
    MainContentComponent,
    FormsModule,
    ModalComponent],
  templateUrl: './payment-page.component.html',
  styleUrls: ['./payment-page.component.css']
})
export class PaymentPageComponent {
  @ViewChild(ModalComponent) modalComponent: ModalComponent | undefined;

  aboutImageUrl = "assets/images/about/renith-r-A9VpotrPr1k-unsplash.jpg";

  maxDate: string = new Date().toISOString().split('T')[0];
  step: number = 1;
  showRatingPopup: boolean = false;
  selectedRating: number = 0;
  feedback: string = '';

  cartItems: any[] = [];
  totalPrice: number = 0;

  user_id: number = 0;

  clientObj = {
    name: '',
    nif: 0,
    birthday: '',
    contact: 0
  }

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private usersService: UsersService,
    private reservationsService: ReservationsService ) {}

  ngOnInit() {
    this.loadCartItems();
    this.userInfo();
  }

  loadCartItems() {
    const cartData = this.cookieService.get('cart');

    if (cartData) {
      try {
        const parsedCart = JSON.parse(cartData);

        if (Array.isArray(parsedCart.items)) {
          this.cartItems = parsedCart.items;

          this.totalPrice = this.cartItems.reduce((total, item) => {
            const pricePerHour = parseFloat(item.pricePerHour);
            const totalHours = parseFloat(item.totalHours);

            if (isNaN(pricePerHour) || isNaN(totalHours)) {
              return total;
            }

            return total + (pricePerHour * totalHours);
          }, 0);
        } else {
          this.modalComponent?.showModal(
            'Erro',
            'Estrutura do carrinho inválida ou "items" não encontrado.'
          );
        }
      } catch (error) {
        this.modalComponent?.showModal(
          'Erro',
          'Erro ao ler os dados do carrinho:' + error
        );
      }
    } else {
      this.modalComponent?.showModal(
        'Erro',
        'Carrinho vazio ou cookie não encontrado.'
      );
    }
  }

  userInfo() {
    this.usersService.userInfo().pipe(
      switchMap((res: any) => {
        this.user_id = res.user.id;
        return this.usersService.clientInfo(this.user_id);
      })
    ).subscribe({
      next: (clientRes: any) => {
        this.clientObj = {
          name: `${clientRes.client.first_name} ${clientRes.client.last_name}`,
          contact: clientRes.client.contact,
          nif: clientRes.client.user.nif,
          birthday: clientRes.client.user.birthday,
        };
      },
      error: (err) => {
        const message = err.error?.message;
        this.modalComponent?.showModal(
          'Erro',
          message
        );
      }
    });
  }

  finalizePayment() {
    this.showPopup();

    const cart = this.cookieService.get('cart') ? JSON.parse(this.cookieService.get('cart')) : { items: [], totalPrice: 0 };
    const user_id = this.user_id;

    this.reservationsService.create(cart).subscribe({
      next: () => {
        this.showPopup();
        this.cookieService.delete('cart', '/');
      },
      error: (err) => {
        this.showPopup();
      }
    });
  }

  formatCardNumber(event: any) {
    let input = event.target;
    let value = input.value.replace(/\D/g, '');

    if (value.length > 16) {
        value = value.substring(0, 16);
    }

    let formattedValue = value.match(/.{1,4}/g)?.join('-') || '';

    input.value = formattedValue;
  }

  validateCardNumber(cardNumber: string): boolean {
    const cleaned = cardNumber.replace(/\D/g, '');
    return cleaned.length === 16;
  }

  validateCVV(event: any) {
    const input = event.target;
    input.value = input.value.replace(/\D/g, '');

    if (input.value.length > 3) {
      input.value = input.value.substring(0, 3);
    }
  }

  formatExpiryDate(event: any) {
    let input = event.target;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 4) {
        value = value.substring(0, 4);
    }

    if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }

    input.value = value;
  }

  validatePhoneNumber(event: any) {
    const input = event.target;
    let phoneNumber = input.value.replace(/\D/g, '');

    const validPrefixes = ['91', '92', '93', '96'];
    if (phoneNumber.length >= 2) {
      const prefix = phoneNumber.substring(0, 2);
      if (!validPrefixes.includes(prefix)) {
        input.value = '';
        Swal.fire({
          icon: 'error',
          title: 'Número inválido',
          text: 'O número de telemóvel deve começar com um prefixo válido (91, 92, 93, 96).',
        });
        return;
      }
    }

    if (phoneNumber.length > 9) {
      phoneNumber = phoneNumber.substring(0, 9);
    }

    input.value = phoneNumber;
  }

  validateNif(event: any) {
    const input = event.target;
    if (input.value.length > 9) {
      input.value = input.value.substring(0, 9);
    }
  }

  validateName(name: string): boolean {
    return name.trim().length >= 3;
  }

  validateAge(dob: string): boolean {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    return age > 18 || (age === 18 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)));
  }

  validateExpiryDate(expiry: string): boolean {
    const [month, year] = expiry.split('/').map(Number);
    if (isNaN(month) || isNaN(year) || month < 1 || month > 12) return false;

    const today = new Date();
    const expiryDate = new Date(year + 2000, month);

    return expiryDate > today;
  }

  nextStep(event: Event, form: NgForm) {
    event.preventDefault();

    if (!form.valid) {
      Swal.fire({
        icon: 'error',
        title: 'Formulário inválido',
        text: 'Por favor, preencha todos os campos obrigatórios!',
      });
      return;
    }

    const formValues = form.value;
    if (this.step === 1) {
      if (!this.validateName(formValues.name)) {
        Swal.fire({
          icon: 'error',
          title: 'Nome inválido',
          text: 'O nome deve ter pelo menos 3 caracteres.',
        });
        return;
      }

      if (!this.validateAge(formValues.dob)) {
        Swal.fire({
          icon: 'error',
          title: 'Idade inválida',
          text: 'Você deve ter pelo menos 18 anos.',
        });
        return;
      }
    }

    if (this.step === 2) {
      if (!this.validateCardNumber(formValues.cardNumber)) {
        Swal.fire({
          icon: 'error',
          title: 'Número de cartão inválido',
          text: 'O número do cartão deve ter 16 dígitos.',
        });
        return;
      }

      if (!this.validateExpiryDate(formValues.expiryDate)) {
        Swal.fire({
          icon: 'error',
          title: 'Data de expiração inválida',
          text: 'A data de expiração deve ser válida e no futuro.',
        });
        return;
      }
    }
    this.step++;
  }

  goToStep(stepNumber: number) {
    this.step = stepNumber;
  }

  showPopup() {
    this.showRatingPopup = true;
  }

  closePopup() {
    this.showRatingPopup = false;
    this.router.navigate(['/']);
  }

  rate(stars: number) {
    this.selectedRating = stars;
  }

  submitRating() {
    console.log('Avaliação: ', this.selectedRating);
    console.log('Feedback: ', this.feedback);
    this.closePopup();
    Swal.fire({
      icon: 'success',
      title: 'Obrigado!',
      text: 'Obrigado pela sua avaliação!',
    }).then(() => {
      this.router.navigate(['/']);
    });
  }
}
