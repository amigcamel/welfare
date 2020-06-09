import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../service/auth.service';
import { Router } from "@angular/router";

@Component({
    selector     : 'login',
    templateUrl  : './login.component.html',
    styleUrls    : ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class LoginComponent implements OnInit
{
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     * @param http
     * @param auth
     * @param router
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private http: HttpClient,
        private auth: AuthService,
        private router: Router
    )
    {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: true
                },
                footer   : {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
        if (localStorage.getItem('token') !== null && localStorage.getItem('user') !== null) {
            this.auth.setIsLogin(true);
            this.router.navigateByUrl('/sample');
        }
    }


    ngOnInit(): void
    {

    }


    Login(): void {
        this.auth.setIsLogin(true);
        location.assign('http://welfare.local.com:5000/login');
    }
}
