import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LayoutConfigService {
  private isShowToolBar = new BehaviorSubject<boolean>(true);
  public isShowToolBar$ = this.isShowToolBar.asObservable();
  constructor() { }
  setIsShowToolBar(state: boolean) {
    this.isShowToolBar.next(state);
  }
  getIsShowToolBar(): boolean {
    return this.isShowToolBar.getValue();
  }

}
