import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Billboard } from '../interface/billboard';

@Injectable({
  providedIn: 'root'
})
export class BillboardService {

  constructor(private http: HttpClient) { }

  public getInfo(): Observable<Billboard> {
    return this.http.get<Billboard>('/api/billboard');
  }
}
