import { Injectable } from '@angular/core';
import { ApiRoutes } from '../config/api-routes';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Promotion } from '../interfaces/promotion';

@Injectable({
  providedIn: 'root'
})
export class PromotionsService {

  constructor(private http: HttpClient) { }

  index(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(ApiRoutes.promotions, {headers })
  }

  create(promotionObj: Promotion): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<any>(ApiRoutes.promotions, promotionObj, { headers })
  }

  delete(promotion_id: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.delete<any>(`${ApiRoutes.promotions}${promotion_id}`, { headers });
  }

  update(id: number, promotion: any): Observable<any> {
    const token = localStorage.getItem('authToken'); 
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.put<any>(`${ApiRoutes.promotions}${id}`, promotion, { headers });
  }

  show(promotion_id: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(`${ApiRoutes.promotions}${promotion_id}`, { headers });
  }

  edit(promotionObj: Promotion, promotion_id: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put<any>(`${ApiRoutes.promotions}${promotion_id}`, promotionObj, { headers })
  }
}
