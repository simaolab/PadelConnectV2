import { Injectable } from '@angular/core';
import { ApiRoutes } from '../config/api-routes';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Court } from '../models/court';

@Injectable({
  providedIn: 'root'
})

export class CourtsService {

  constructor(private http: HttpClient) { }

  index(): Observable<any> {
    return this.http.get<any>(ApiRoutes.courts);
  }

  create(courtObj: Court): Observable<any> {
      const token = localStorage.getItem('authToken');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      return this.http.post<any>(ApiRoutes.courts, courtObj, { headers });
  }

  show(court_id: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(`${ApiRoutes.courts}${court_id}`, { headers });
  }

  edit(courtObj: Court, court_id: number): Observable<any> {
      const token = localStorage.getItem('authToken');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      return this.http.put<any>(`${ApiRoutes.courts}${court_id}`, courtObj, { headers });
  }

  delete(court_id: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.delete<any>(`${ApiRoutes.courts}${court_id}`, { headers });
  }
}
