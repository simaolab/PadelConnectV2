import { Injectable } from '@angular/core';
import { ApiRoutes } from '../config/api-routes';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cart } from '../interfaces/cart';

@Injectable({
  providedIn: 'root'
})
export class ReservationsService {

  constructor(private http: HttpClient) { }

  index(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(ApiRoutes.reservations, { headers });
  }

  create(cart: Cart, user_id: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const reservationPayload = {
      user_id: user_id,
      status: 'pendente',
      start_date: cart.items[0]?.startDate,
      end_date: cart.items[0]?.endDate,
      total: cart.totalPrice,
      privacy_policy: true,
      fields: cart.items.map(item => item.fieldId),
  };

    return this.http.put<any>(ApiRoutes.reservations, reservationPayload, { headers });
  }
}
