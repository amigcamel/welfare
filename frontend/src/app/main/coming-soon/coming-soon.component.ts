import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { Router } from '@angular/router';
import { WelfareTimeService } from '../../service/welfare-time.service';
import { CountDown } from '../../model/count-down';

@Component({
    selector     : 'coming-soon',
    templateUrl  : './coming-soon.component.html',
    styleUrls    : ['./coming-soon.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ComingSoonComponent implements OnInit
{
    countdownDate: CountDown;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     * @param router
     * @param welfareTimeService
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private router: Router,
        private welfareTimeService: WelfareTimeService
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
        setInterval(_ => {
            this.countdownDate = this.welfareTimeService.countDown('2020-06-08');
        }, 1000);
    }

    goBack(): void {
        this.router.navigateByUrl('/sample');
    }
}
