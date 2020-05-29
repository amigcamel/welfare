import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
      const token = localStorage.getItem('token');
      const apiUrl = request.url.startsWith(environment.apiUrl);
      const helper = new JwtHelperService();
      if (apiUrl && token) {
          request = request.clone(
              {
                  setHeaders: {
                    Authorization: `Bearer ${token}`
                  }
              }
          );
      }
      return next.handle(request);
  }
}
