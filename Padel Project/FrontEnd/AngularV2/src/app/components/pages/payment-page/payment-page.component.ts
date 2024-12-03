import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { PageTopComponent } from './../../utilities/page-top/page-top.component';
import { MainContentComponent } from '../../utilities/main-content/main-content.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-payment-page',
  standalone: true,
  imports: [CommonModule, PageTopComponent, MainContentComponent, FormsModule],
  templateUrl: './payment-page.component.html',
  styleUrls: ['./payment-page.component.css']
})
export class PaymentPageComponent {
  aboutImageUrl = "assets/images/about/renith-r-A9VpotrPr1k-unsplash.jpg";
  maxDate: string = new Date().toISOString().split('T')[0];
  step: number = 1;
  showRatingPopup: boolean = false;
  selectedRating: number = 0;
  feedback: string = '';

  constructor(private router: Router) {}

  // Método para formatar o número do cartão com traços
  formatCardNumber(event: any) {
    let input = event.target;
    let value = input.value.replace(/\D/g, '');

    if (value.length > 16) {
        value = value.substring(0, 16); 
    }

    // Adiciona traços a cada 4 dígitos
    let formattedValue = value.match(/.{1,4}/g)?.join('-') || ''; 

    input.value = formattedValue;
  }

  // Método para validar o número do cartão
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

  // Método para formatar a data de validade no formato MM/AA
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

  // Valida se o número de telefone é um número de telemóvel português válido
  validatePhoneNumber(event: any) {
    const input = event.target;
    let phoneNumber = input.value.replace(/\D/g, ''); // Remove caracteres não numéricos

    // Verifica o primeiro e segundo dígito
    const validPrefixes = ['91', '92', '93', '96']; // Prefixos válidos de números de telemóveis portugueses

    if (phoneNumber.length >= 2) {
      const prefix = phoneNumber.substring(0, 2);

      // Se os dois primeiros dígitos não forem de um prefixo válido, limpa o campo e alerta o usuário
      if (!validPrefixes.includes(prefix)) {
        input.value = ''; // Limpa o input
        Swal.fire({
          icon: 'error',
          title: 'Número inválido',
          text: 'O número de telemóvel deve começar com um prefixo válido (91, 92, 93, 96).',
        });
        return;
      }
    }

    // Limita a 9 dígitos
    if (phoneNumber.length > 9) {
      phoneNumber = phoneNumber.substring(0, 9);
    }

    input.value = phoneNumber; // Atualiza o valor no campo de input
  }

  // Método de validação para o campo NIF
  validateNif(event: any) {
    const input = event.target;
    if (input.value.length > 9) {
      input.value = input.value.substring(0, 9);
    }
  }

  // Valida se o nome tem pelo menos 3 caracteres
  validateName(name: string): boolean {
    return name.trim().length >= 3;
  }

  // Valida se a data de nascimento indica pelo menos 18 anos
  validateAge(dob: string): boolean {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    
    return age > 18 || (age === 18 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)));
  }

  // Valida se a data de expiração é válida (formato e data futura)
  validateExpiryDate(expiry: string): boolean {
    const [month, year] = expiry.split('/').map(Number);
    if (isNaN(month) || isNaN(year) || month < 1 || month > 12) return false;

    const today = new Date();
    const expiryDate = new Date(year + 2000, month);

    return expiryDate > today;
  }

  // Função chamada ao enviar o formulário
  nextStep(event: Event, form: NgForm) {
    event.preventDefault();

    if (!form.valid) {
      Swal.fire({
        icon: 'error',
        title: 'Formulário inválido',
        text: 'Por favor, preencha todos os campos obrigatórios!',
      });
      return; // Não avança se o formulário não for válido
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
  console.log("Step:", this.step);
  }

  // Outros métodos existentes
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

  finalizePayment() {
    this.showPopup();
  }
}
