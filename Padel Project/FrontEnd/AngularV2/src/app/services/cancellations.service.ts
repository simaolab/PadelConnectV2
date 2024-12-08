import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiRoutes } from '../config/api-routes';

@Injectable({
  providedIn: 'root'
})
export class CancellationsService {

  constructor(private http: HttpClient) { }

  index(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(ApiRoutes.cancellations, { headers });
  }
}
