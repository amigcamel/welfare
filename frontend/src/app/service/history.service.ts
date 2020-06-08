import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { AfternoonTeaForm } from "../model/afternoon-tea-form";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class HistoryService implements Resolve<any>{
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this.getHistory().pipe(catchError((err) => {
            console.log('load history error:', err);
            return  throwError(err);
        }));
    }
  constructor(private http: HttpClient) { }

  getHistory(): Observable<any> {
      return this.http.get('/history')
  }
}

