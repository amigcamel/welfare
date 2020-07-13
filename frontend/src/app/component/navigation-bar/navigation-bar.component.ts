import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SideBarService } from '../../service/side-bar.service';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../service/auth.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit, OnDestroy{
  private unSubscribe = new Subject<boolean>();
  constructor(private router: Router,
              private sideBarService: SideBarService,
              private authService: AuthService) { }
  @Output() private closeSideBar: EventEmitter<boolean> = new EventEmitter();
  ngOnInit(): void {
  }
  public navigateTo(url: string) {
    this.router.navigateByUrl(url);
    this.sideBarService.setIsShow(false);
  }
  public logOut(): void {
    this.authService.logout().pipe(takeUntil(this.unSubscribe.asObservable())).subscribe(_ => {
      this.closeSideBar.emit(true);
      localStorage.removeItem('token');
      this.authService.setIsLogin(false);
      this.router.navigateByUrl('/login');
    }, error => {
      console.log('log out error:', error);
    });
  }
  ngOnDestroy() {
    this.unSubscribe.next(true);
    this.unSubscribe.complete();
  }
}
