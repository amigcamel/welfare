import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormService {

    constructor(private http: HttpClient) {
    }
    getForm(): Observable<any> {
        return  this.http.get('/form');
    }
    sendForm(data: any): Observable<any> {
        return this.http.post('/form', data);
    }

}
