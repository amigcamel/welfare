import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private isLogin = new BehaviorSubject<boolean>(false);

    constructor() { }

    public getIsLogin(): boolean {
        return this.isLogin.getValue();
    }

    public setIsLogin(state: boolean): void {
        return this.isLogin.next(state);
    }
}
