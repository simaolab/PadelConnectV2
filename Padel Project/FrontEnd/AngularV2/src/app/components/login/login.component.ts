import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
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
  @ViewChild('container', { static: false }) container: ElementRef | undefined;
  @ViewChild('step1', { static: false }) step1: ElementRef | undefined;
  @ViewChild('step2', { static: false }) step2: ElementRef | undefined;
  @ViewChild('registerBtn', { static: false }) registerBtn: ElementRef | undefined;
  @ViewChild('loginBtn', { static: false }) loginBtn: ElementRef | undefined;

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

  formErrors: { [key: string]: string } = {};

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
    this.authService.register(this.registerObj).subscribe({
      next: (res: any) => {
        console.log(res)
        if (res.status === 'success') {
          console.log("cheguei")
            this.modalComponent?.showModal(
              'Sucess',
              res.message
            )
            setTimeout(() => {
              location.reload();
            }, 1500);
        }
      },
      error: (err) => {
        // const errorMessage = err.error?.message;
        // this.modalComponent?.showModal(
        //   'Erro',
        //   errorMessage
        // );

        this.formErrors = {};
        const errorDetails = err.error?.['error(s)'] || {};
          for (const court in errorDetails) {
            if (errorDetails.hasOwnProperty(court)) {
              this.formErrors[court] = errorDetails[court][0];
            }
          }
      }
    });
  }

  private clearCart() {
    this.cookieService.delete('cart');
  }
}
