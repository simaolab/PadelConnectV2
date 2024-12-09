import { Injectable } from '@angular/core';
import { ApiRoutes } from '../config/api-routes';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Court } from '../interfaces/court';

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

    const formData = new FormData();

    formData.append('name', courtObj.name);
    formData.append('company_id', courtObj.company_id.toString());
    formData.append('price_hour', courtObj.price_hour.toString());
    formData.append('type_floor', courtObj.type_floor);
    formData.append('status', courtObj.status);
    formData.append('illumination', courtObj.illumination.toString());
    formData.append('cover', courtObj.cover.toString());
    formData.append('last_maintenance', courtObj.last_maintenance || '');
    formData.append('shower_room', courtObj.shower_room.toString());
    formData.append('lockers', courtObj.lockers.toString());
    formData.append('rent_equipment', courtObj.rent_equipment.toString());

    formData.append('schedules[weekdays][opening_time]', courtObj.schedules.weekdays.opening_time || '');
    formData.append('schedules[weekdays][closing_time]', courtObj.schedules.weekdays.closing_time || '');
    formData.append('schedules[weekdays][is_closed]', courtObj.schedules.weekdays.is_closed.toString());

    formData.append('schedules[saturday][opening_time]', courtObj.schedules.saturday.opening_time || '');
    formData.append('schedules[saturday][closing_time]', courtObj.schedules.saturday.closing_time || '');
    formData.append('schedules[saturday][is_closed]', courtObj.schedules.saturday.is_closed.toString());

    formData.append('schedules[sunday][opening_time]', courtObj.schedules.sunday.opening_time || '');
    formData.append('schedules[sunday][closing_time]', courtObj.schedules.sunday.closing_time || '');
    formData.append('schedules[sunday][is_closed]', courtObj.schedules.sunday.is_closed.toString());

    if (courtObj.file_path) {
      formData.append('file_path', courtObj.file_path);
    }

    return this.http.post<any>(ApiRoutes.courts, formData, { headers });
  }

  show(court_id: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(`${ApiRoutes.courts}${court_id}`, { headers });
  }

  getCourtImage(filePath: string): string {
    return filePath ? `https://api.padelconnect.pt/storage/${filePath}` : 'assets/images/default-image.jpg';
  }

  edit(courtObj: Court, court_id: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    console.log(courtObj);
    return this.http.put<any>(`${ApiRoutes.courts}${court_id}`, courtObj, { headers });
  }

  update(court_id: number, courtObj: Partial<Court>): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.patch<any>(`${ApiRoutes.courts}${court_id}`, courtObj, { headers });
  }

  delete(court_id: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.delete<any>(`${ApiRoutes.courts}${court_id}`, { headers });
  }

  search(name: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(`${ApiRoutes.courts}search/${name}`, { headers });
  }

}
