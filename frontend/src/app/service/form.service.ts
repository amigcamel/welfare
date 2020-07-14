import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { AfternoonTeaForm } from '../interface/afternoon-tea-form';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { CartBudget } from '../interface/cart';
@Injectable({
  providedIn: 'root'
})
export class FormService implements Resolve<AfternoonTeaForm> {
  private cartInfo = new BehaviorSubject<CartBudget>({
    budget: 200,
    sum: 0,
  });
  public cartInfo$ = this.cartInfo.asObservable();
  private cartDialog = new Subject<any>();
  public cartDialog$ = this.cartDialog.asObservable();

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
      return this.getForm().pipe(catchError((err) => {
          console.log('load form error:', err);
          return  throwError(err);
      }));
  }
  constructor(private http: HttpClient) {
  }

  getForm(): Observable<AfternoonTeaForm> {
      return  this.http.get<AfternoonTeaForm>('/api/afternoontea');
  }
  sendForm(data: any): Observable<any> {
      return this.http.post('/api/afternoontea', data);
  }
  setCartInfo(cartInfo) {
    this.cartInfo.next(cartInfo);
  }
  emitCartDialog(signal) {
    this.cartDialog.next(signal);
  }
}
