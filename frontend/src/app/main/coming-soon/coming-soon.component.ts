import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { Router } from '@angular/router';

@Component({
    selector     : 'coming-soon',
    templateUrl  : './coming-soon.component.html',
    styleUrls    : ['./coming-soon.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ComingSoonComponent implements OnInit
{
    countdownDate;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     * @param router
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private router: Router,
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
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.countdownDate = new Date('2020-06-08');
        setInterval(_ => this.countDown(), 1000);
    }
    countDown(): void{
        const now = new Date().getTime();
        const timeleft = this.countdownDate - now;

        this.days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
        this.hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        this.minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
        this.seconds = Math.floor((timeleft % (1000 * 60)) / 1000);
    }
    goBack(): void {
        this.router.navigateByUrl('/sample');
    }
}
