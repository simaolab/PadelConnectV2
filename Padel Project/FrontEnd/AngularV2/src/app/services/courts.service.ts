import { Injectable } from '@angular/core';
import { ApiRoutes } from '../config/api-routes';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CourtsService {

  constructor(private http: HttpClient) { }

  index(): Observable<any> {
    return this.http.get<any>(ApiRoutes.courts);
  }
}
