import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  constructor(private http: HttpClient) { }
  getJSON(): Observable<any> {
    return this.http.get<any>('/afternoontea/5ed7162dabef6e0f09705354');
  }
}
