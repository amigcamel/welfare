import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../service/auth.service";
import { LayoutConfigService } from "../../service/layout-config.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService,
              private layoutConfigService: LayoutConfigService) {
    this.layoutConfigService.setIsShowToolBar(false);
  }

  ngOnInit(): void {
  }
  Login(): void {
    this.authService.setIsLogin(true);
    location.assign('/api/login');
  }

}
