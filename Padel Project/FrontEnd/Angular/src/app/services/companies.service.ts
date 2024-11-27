import { Injectable } from '@angular/core';
import { ApiRoutes } from '../config/api-routes';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CompaniesService {

  constructor(private http: HttpClient) { }

  index(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(ApiRoutes.companies, { headers });
  }

  create(companyObj: {
    address_id: number;
    name: string;
    email: string;
    contact: number;
    nif: number;
    newsletter: number }): Observable<any> {
      const token = localStorage.getItem('authToken');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      return this.http.post<any>(ApiRoutes.companies, companyObj, { headers });
  }
}
