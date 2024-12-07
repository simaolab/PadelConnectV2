import { Injectable } from '@angular/core';
import { ApiRoutes } from '../config/api-routes'; // Certifique-se de que esta configuração está correta
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) {}

   // Method to process payment with Stripe
   processPayment(paymentDetails: any): Observable<any> {
    const token = localStorage.getItem('authToken'); // Retrieve the auth token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Content-Type', 'application/json'); // Set auth and JSON headers

    // Send a POST request with payment details provided by the user
    return this.http.post<any>(ApiRoutes.payments, paymentDetails, { headers });
  }

  // Method to create a payment intent for Stripe
  createPaymentIntent(amount: number, currency: string = 'eur'): Observable<any> {
    const token = localStorage.getItem('authToken'); // Retrieve the auth token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Content-Type', 'application/json');

    const body = { amount, currency }; // Prepare the body for the request

    return this.http.post<any>(`${ApiRoutes.payments}`, body, { headers });
  }
}
