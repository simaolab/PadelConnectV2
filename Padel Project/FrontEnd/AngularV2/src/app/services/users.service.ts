import { Injectable } from '@angular/core';
import { ApiRoutes } from '../config/api-routes';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) {}


  index(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(ApiRoutes.users, { headers });
  }

  show(user_id: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(`${ApiRoutes.users}${user_id}`, { headers });
  }

  edit(
    customerObj = {
      email: '',
      username: '',
      nif: 0,
      birthday: '',
      last_login: '',
      email_verified_at: '',
      new_user: 0,
      user_blocked: 0,
      blocked_at: null,
      role_id: ''
    }, user_id: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.put(`${ApiRoutes.users}${user_id}`, customerObj, { headers });
  }

  userInfo(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(ApiRoutes.userInfo, { headers });
  }

  clientInfo(client_id: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(`${ApiRoutes.client}${client_id}`, { headers });
  }

  editClient(clientObj: {

  }, client_id: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${ApiRoutes.client}${client_id}`, clientObj, { headers });
  }

  updatePassword(passwordData: { current_password: string, new_password: string, new_password_confirmation: string }): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${ApiRoutes.updatePassword}`, passwordData, { headers });
  }
}
