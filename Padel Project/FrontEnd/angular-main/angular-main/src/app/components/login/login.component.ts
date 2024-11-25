import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { console } from 'inspector';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginObj = {
    email: '',
    password: ''
  };

  urlLogin = "http://127.0.0.1:8000/api/login";
  urlRegister = "http://127.0.0.1:8000/api/register";

  http=inject(HttpClient);

  constructor(private router:Router) {

  }

  login() {
    this.http.post(this.urlLogin, this.loginObj,
      { withCredentials: true })
      .subscribe((res: any) => {
      if (res.status === 'success') {
        alert('Login sucesso');
        this.router.navigateByUrl("dashboard")
      } else if (res.status === 'error') {
        alert('Verifique as informações');
      }
    });

  }
}
