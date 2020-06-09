import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SideBarService {

  private isShow = new BehaviorSubject<boolean>(false);
  public isShow$ = this.isShow.asObservable()

  constructor() { }

  public setIsShow(state: boolean): void {
    this.isShow.next(state);
  }
  public getIsShow(): boolean {
    return this.isShow.getValue();
  }

}
