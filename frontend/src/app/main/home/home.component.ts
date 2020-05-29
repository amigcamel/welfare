import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private userService: UserService,
              private authService: AuthService

  ) {

  }

  ngOnInit(): void {
      this.activatedRoute.queryParams.subscribe(
          params => {
              if (true) {
                  if (params && params['token'] !== undefined) {
                      localStorage.setItem('token', params['token']);
                      this.userService.getUser().subscribe(user => {
                          this.authService.setUser(user);
                          this.router.navigateByUrl('/sample');
                      }, error => {
                          console.log('login error', error);
                      });
                  } else {
                      this.router.navigateByUrl('/login');
                  }
              } else {
                  this.router.navigateByUrl('/forms');
              }
          }
      );
  }

}
