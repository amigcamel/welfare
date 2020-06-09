import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { UserService } from '../../service/user.service';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
   private unSub = new Subject<boolean>();
  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private userService: UserService,
              private authService: AuthService

  ) {

  }

  ngOnInit(): void {
      this.activatedRoute.queryParams.pipe(takeUntil(this.unSub.asObservable()), switchMap(params => {
          if (params && params['token'] !== undefined) {
              localStorage.setItem('token', params['token']);
              this.authService.setIsLogin(true);
              return this.userService.getUser();
          } else {
              this.router.navigateByUrl('/login');
              return of(null)
          }
      })).subscribe(
          user => {
              if (user !== null) {
                  this.authService.setUser(user);
                  this.router.navigateByUrl('/sample');
              }
          }, error => {
              console.log('login error', error);
          });
  }

  ngOnDestroy(): void {
      this.unSub.next(true);
  }

}
