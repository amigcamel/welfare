import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutConfigService {
  private isShowToolBar = new BehaviorSubject<boolean>(true);
  public isShowToolBar$ = this.isShowToolBar.asObservable();
  private isDesktop = new BehaviorSubject<boolean>(true);
  public  isDesktop$ = this.isDesktop.asObservable();
  constructor() { }
  public setIsShowToolBar(state: boolean) {
    this.isShowToolBar.next(state);
  }
  public getIsShowToolBar(): boolean {
    return this.isShowToolBar.getValue();
  }

  public setIsDesktop(state: boolean) {
    this.isDesktop.next(state);
  }
  public getIsDesktop(): boolean {
    return this.isDesktop.getValue();
  }

}
