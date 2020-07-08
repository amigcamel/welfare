import { Component, OnDestroy, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SideBarService } from '../../service/side-bar.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../service/auth.service';
import { UserInfo } from '../../interface/userinfo';

@Component({
  selector: 'app-side-bar',
  animations: [
    trigger('openClose', [
      state('open', style({
        width: '450px',
        opacity: 1
      })),
      state('closed', style({
        width: '0px',
        opacity: 0.5
      })),
      transition('open <=> closed', [
        animate('.5s ease-in')
      ]),
    ]),
  ],
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],

})
export class SideBarComponent implements OnInit, OnDestroy {
  isOpen: boolean;
  UnSubscribe = new Subject<boolean>();
  userInfo: UserInfo;
  constructor(private sideBarService: SideBarService,
              private authService: AuthService) {

  }

  ngOnInit(): void {
    this.sideBarService.isShow$.pipe(takeUntil(this.UnSubscribe.asObservable())).subscribe(check => {
      this.isOpen = check;
    });
    this.authService.currentUser$.pipe(takeUntil(this.UnSubscribe.asObservable())).subscribe(user => {
      this.userInfo = user;
    });
  }
  public closeSideBar() {
    this.sideBarService.setIsShow(false);
  }
  ngOnDestroy() {
    this.UnSubscribe.next(true);
    this.UnSubscribe.complete();
  }

}
