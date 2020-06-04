import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as data from '../service/mock.json'

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  constructor(private http: HttpClient) { }
  // getJSON(): Observable<any> {
  //   return this.http.get<any>('/afternoontea/demo_1');
  // }
    getJSON(): any {
      return data['default'];
    }
}
