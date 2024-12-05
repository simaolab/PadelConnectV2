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

  create(cart: Cart): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const reservationPayload = {
        status: 'pendente',
        privacy_policy: true,
        reservations: cart.items.map(item => {
            const startDate = this.formatDate(item.startDate);
            const endDate = this.formatDate(item.endDate);

            return {
                start_date: startDate,
                end_date: endDate,
                total: item.totalPrice,
                fields: [item.fieldId],
                additional_info: 'Informações adicionais, se necessário'
            };
        })
    };
    return this.http.post<any>(ApiRoutes.reservations, reservationPayload, { headers });
  }

  private formatDate(date: string): string {
    const d = new Date(date);
    const day = ('0' + d.getDate()).slice(-2);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const year = d.getFullYear();
    const hours = ('0' + d.getHours()).slice(-2);
    const minutes = ('0' + d.getMinutes()).slice(-2);
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
}
