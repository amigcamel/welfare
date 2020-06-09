import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AfternoonTeaForm } from '../interface/afternoon-tea-form';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { tryCatch } from 'rxjs/internal-compatibility';

@Injectable({
  providedIn: 'root'
})
export class FormService implements Resolve<AfternoonTeaForm> {

    constructor(private http: HttpClient) {
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this.getForm().pipe(catchError((err) => {
            console.log('load form error:', err);
            return  throwError(err);
        }));
    }

    getForm(): Observable<AfternoonTeaForm> {
        return  this.http.get<AfternoonTeaForm>('/afternoontea/demo_1');
    }
    sendForm(data: any): Observable<any> {
        return this.http.post('/afternoontea/demo_1', data);
    }
}
