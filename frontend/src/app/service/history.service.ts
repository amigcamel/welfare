import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { Orders } from '../interface/history';

@Injectable({
  providedIn: 'root'
})
export class HistoryService implements Resolve<Orders[]>{
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this.getHistory().pipe(catchError((err) => {
            console.log('load history error:', err);
            return  throwError(err);
        }));
    }
  constructor(private http: HttpClient) { }

  getHistory(): Observable<any> {
      return this.http.get('/api/history');
  }
}

