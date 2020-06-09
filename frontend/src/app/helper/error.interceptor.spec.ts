import { TestBed } from '@angular/core/testing';

import { ErrorInterceptor } from './error.interceptor';
import { HttpClientModule } from "@angular/common/http";
import { RouterTestingModule } from "@angular/router/testing";

describe('ErrorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule,
      RouterTestingModule
    ],
    providers: [
      ErrorInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: ErrorInterceptor = TestBed.inject(ErrorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
