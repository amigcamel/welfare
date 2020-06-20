import { Component, OnDestroy, OnInit } from '@angular/core';
import { SideBarService } from "../../service/side-bar.service";
import { AuthService } from "../../service/auth.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { UserInfo } from "../../interface/userinfo";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { LayoutConfigService } from "../../service/layout-config.service";

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.scss']
})
export class ToolBarComponent implements OnInit, OnDestroy {
  unSubscribe = new Subject<boolean>()
  userInfo: UserInfo;
  mat
  constructor(private sideBarService: SideBarService,
              private authService: AuthService,
              private router: Router,
              private matDialog: MatDialog,
              public layoutConfigService: LayoutConfigService) { }

  ngOnInit(): void {
    this.authService.currentUser$.pipe(takeUntil(this.unSubscribe.asObservable())).subscribe(
      user => {
        this.userInfo = user;
      }
    )
  }
  public openSideBar(): void {
    this.sideBarService.setIsShow(true);
  }
  public logOut(): void {
    this.authService.logout().pipe(takeUntil(this.unSubscribe.asObservable())).subscribe(_ => {
      localStorage.removeItem('token');
      this.authService.setIsLogin(false);
      this.router.navigateByUrl('/login');
    },error => {
      console.log("log out error:", error)
    });
  }
  ngOnDestroy() {
    this.unSubscribe.next(true);
    this.unSubscribe.complete();
  }

}
