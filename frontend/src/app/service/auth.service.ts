import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { UserInfo } from '../model/userinfo';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private isLogin = new BehaviorSubject<boolean>(false);
    private currentUser = new BehaviorSubject<UserInfo>({
        email: '',
        family_name: '',
        given_name: '',
        hd: '',
        id: '',
        locale: '',
        name: '',
        picture: '',
        verified_email: false
    });
    public currentUser$ = this.currentUser.asObservable();

    constructor(private http: HttpClient) {
        if ( localStorage.getItem('user') !== null) {
            this.setUser(JSON.parse(localStorage.getItem('user')));
        }
    }

    public getIsLogin(): boolean {
        return this.isLogin.getValue();
    }

    public setIsLogin(state: boolean): void {
        return this.isLogin.next(state);
    }

    public logout(): Observable<Object> {
        return this.http.get('logout');

    }
    setUser(user: UserInfo): void {
        this.currentUser.next(user);
        localStorage.setItem('user', JSON.stringify(user));
    }
    getCurrentUser(): UserInfo {
        return this.currentUser.getValue();
    }
}
