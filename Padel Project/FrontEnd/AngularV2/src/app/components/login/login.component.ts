import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ModalComponent } from '../utilities/modal/modal.component';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ModalComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  @ViewChild(ModalComponent) modalComponent: ModalComponent | undefined;

  loginObj = {
    login: '',
    password: ''
  };

  registerObj = {
    username: '',
    email: '',
    nif: 0,
    birthday: '',
    password: '',
    password_confirmation: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private cookieService: CookieService
  ) {}

  login() {
    this.authService.login(this.loginObj).subscribe({
      next: (res: any) => {
        if (res.status === 'success') {
          const token = res.token;
          localStorage.setItem('authToken', token);

          const username = res.user_info.username;
          localStorage.setItem('username', username);

          this.clearCart();

          this.modalComponent?.showModal(
            'Sucesso',
            res.message
          );

          this.modalComponent?.modalClosed.subscribe(() => {
            this.router.navigateByUrl('dashboard');
          });
        }
      },
      error: (err) => {
        const errorMessage = err.error?.message;
        this.modalComponent?.showModal(
          'Erro',
          errorMessage
        );
      }
    });
  }

  register() {
    console.log(this.registerObj.birthday)
    this.authService.register(this.registerObj).subscribe({
      next: (res: any) => {
        if (res.status === 'success') {
          this.modalComponent?.modalClosed.subscribe(() => {
            this.modalComponent?.showModal(
              'Erro',
              res.message
            );
            location.reload();
          });
        }
      },
      error: (err) => {
        const errorMessage = err.error?.message;
        this.modalComponent?.showModal(
          'Erro',
          errorMessage
        );
      }
    });
  }

  // convertToDateFormat(date: any): string {
  //   if (!date) return '';

  //   if (date instanceof Date) {
  //     // Caso seja um objeto Date
  //     const day = date.getDate().toString().padStart(2, '0');  // Adiciona zero à esquerda se necessário
  //     const month = (date.getMonth() + 1).toString().padStart(2, '0');  // Meses começam do zero
  //     const year = date.getFullYear();
  //     return `${year}-${month}-${day}`;
  //   }

  //   // Caso seja uma string no formato dd/mm/yyyy
  //   const [day, month, year] = date.split('/');
  //   return `${year}-${month}-${day}`;
  // }

  private clearCart() {
    this.cookieService.delete('cart');
  }
}
