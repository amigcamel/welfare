import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { UserInfo } from '../interface/userinfo';
import {HttpClient} from "@angular/common/http";
import { Router } from "@angular/router";

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
    public redirectURL: string;

    constructor(private http: HttpClient,private router: Router) {
        if (localStorage.getItem('token') !== null && localStorage.getItem('user') !== null) {
            this.setIsLogin(true);
            this.setUser(JSON.parse(localStorage.getItem('user')));
            if(this.redirectURL) {
                this.router.navigate([this.redirectURL]);
            }
        } else {
            this.setIsLogin(false);
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
