import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private authenticationService: AuthService, private router: Router) {
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            console.log('error interceptors', err)
            if (err.status === 401) {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                this.authenticationService.setIsLogin(false);
                this.router.navigateByUrl('/login');
            } else if (err.status === 404) {
                this.router.navigateByUrl('error-page/not-found');
            } else if (err.status === 403) {
                this.router.navigateByUrl('error-page/no-auth');
            }
            const error = err.error.message || err.statusText;
            return throwError(error);
        }));
    }
}
