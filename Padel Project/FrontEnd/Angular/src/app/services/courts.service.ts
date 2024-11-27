import { Injectable } from '@angular/core';
import { ApiRoutes } from '../config/api-routes';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CourtsService {

  constructor(private http: HttpClient) { }

  index(): Observable<any> {
    return this.http.get<any>(ApiRoutes.courts);
  }

  create(courtObj: {
    name: string;
    company_id: number;
    price_hour: number;
    type_floor: string;
    status: string;
    cover: number;
    last_maintenance: string }): Observable<any> {
      const token = localStorage.getItem('authToken');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      return this.http.post<any>(ApiRoutes.courts, courtObj, { headers });
  }
}
