import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiRoutes } from '../config/api-routes';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private http: HttpClient) {}

  // login(loginObj: { login: string; password: string }): Observable<any> {
  //   return this.http.post(ApiRoutes.login, loginObj, { withCredentials: true });
  // }

  login(loginObj: { login: string, password: string }): Observable<any> {
    // Fazer a requisição para configurar o CSRF
    return this.http.get('https://api.padelconnect.pt/sanctum/csrf-cookie', { withCredentials: true })
      .pipe(
        // Depois de configurar o cookie CSRF, fazemos o login
        switchMap(() => {
          return this.http.post('https://api.padelconnect.pt/api/login', loginObj, { withCredentials: true });
        })
      );
  }

  register(registerObj: { username: string; email: string; nif: number; password: string })
  {
    return this.http.post(ApiRoutes.register, registerObj);
  }

  logout(): Observable<any> {
    return this.http.post(ApiRoutes.logout, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
  }
}
