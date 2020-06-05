import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { QuestionService } from '../../service/question.service';
import { HttpClient } from '@angular/common/http';

import { FormService } from '../../service/form.service';
import { MatDialog } from '@angular/material/dialog';
import { PhotoDialogComponent } from '../../component/photo-dialog/photo-dialog.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DialogComponent } from '../../component/dialog/dialog.component';
import { FuseConfigService } from '../../../@fuse/services/config.service';
import { CartDialogComponent } from '../../component/cart-dialog/cart-dialog.component';
import { Cart } from '../../model/cart';
import { switchMap, takeUntil } from 'rxjs/operators';
import { WelfareTimeService } from '../../service/welfare-time.service';
import { CountDown } from '../../model/count-down';
import { AfternoonTeaForm } from '../../model/afternoon-tea-form';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector   : 'forms',
    animations: [
        trigger('openClose', [
            state('open', style({
                height: '*',
            })),
            state('closed', style({
                height: '100px',
            })),
            transition('open <=> closed', [
                animate('.5s ease-in')
            ]),
        ]),
    ],
    templateUrl: './forms.component.html',
    styleUrls  : ['./forms.component.scss']
})
export class FormsComponent implements OnInit, OnDestroy
{
    public sum = 0;
    public isDark = false;
    public filterTarget = '';
    public expiration: CountDown;
    public formData: AfternoonTeaForm;
    // Private
    private _unsubscribeAll: Subject<any>;
    private unSub: Subject<boolean>;

    /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     * @param http
     * @param mock
     * @param fuseConfigService
     * @param formService
     * @param matDialog
     * @param welfareTimeService
     * @param activatedRoute
     */
    constructor(
        private _formBuilder: FormBuilder,
        private http: HttpClient,
        private mock: QuestionService,
        private fuseConfigService: FuseConfigService,
        private formService: FormService,
        private matDialog: MatDialog,
        private welfareTimeService: WelfareTimeService,
        private activatedRoute: ActivatedRoute
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.unSub = new Subject();
    }



    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        console.log(this.activatedRoute.snapshot.data, 'init');
        this.formData = this.activatedRoute.snapshot.data.formData;
        setInterval(_ => {
            this.expiration = this.welfareTimeService.countDown(this.formData.expiration);
        }, 1000);

        this.fuseConfigService.getConfig().pipe(takeUntil(this.unSub.asObservable())).subscribe(config => {
            this.isDark = !(config['colorTheme'] === 'theme-yellow-light' || config['colorTheme'] === 'theme-default');
        });

    }
    public filterText(target: string): boolean {
        if (this.filterTarget === '') {
            return true;
        } else {
            const regexp = new RegExp(this.filterTarget, 'gi');
            return regexp.test(target);
        }
    }
    public subOne(step: number, key: string): void {
        for (const item of this.formData.form[step]['items']) {
            if (item.key === key) {
                if (item.value > 0) {
                    item.value =  parseInt(item.value, 10) - 1;
                    this.calculatorSum();
                }
            } else {
                item['isOpen'] = false;
            }
        }
    }
    public addOne(step: number, key: string): void {
        for (const item of this.formData.form[step]['items']) {
            if (item.key === key) {
                item.value =  parseInt(item.value, 10) + 1;
                this.calculatorSum();
                if (this.sum > parseInt(this.formData.budget, 10)) {
                    item.value =  parseInt(item.value, 10) - 1;
                    this.calculatorSum();
                }
            } else {
                item['isOpen'] = false;
            }
        }

    }
    public seeMenu(src: string): void {
        this.matDialog.open(PhotoDialogComponent, {
            data: {
                imageSource: src
            }
        });
    }
    public checkedOption(step: number, itemKey: string, optionKey: string): void {
        for (const item of this.formData.form[step]['items']) {
            if (item.key === itemKey) {
                for (const option of item.options) {
                    if (option.key === optionKey) {
                        option['choose'] = !option['choose'];
                        this.calculatorSum();
                    }
                }
            }
        }
    }
    public calculatorSum(): void {
        this.sum = 0;
        for (const step of this.formData.form) {
            for (const item of step['items']) {
                let options = 0;
                for (const option of item['options']) {
                    if (option['choose']) {
                        options += parseInt(option['price'], 10);
                    }
                }
                this.sum +=  (options + parseInt(item['sizeSelect'], 10)) * parseInt(item['value'], 10);
            }
        }
        if (isNaN(this.sum)) {
            this.matDialog.open(DialogComponent, {
                data: {
                    title: 'Error Message',
                    errorMessage: 'Please Input correct number'
                },
                panelClass: 'form-dialog'
            });
        } else if (this.sum > parseInt(this.formData.budget, 10)) {
            this.matDialog.open(DialogComponent, {
                data: {
                    title: 'Warn Message',
                    errorMessage: 'Sorry you exceed budget'
                },
                panelClass: 'form-dialog'
            });
        }
    }
    public closeAllExpand(): void {
        for (const step of this.formData.form) {
            for (const item of step['items']) {
                item['isOpen'] = false;
            }
        }
        this.filterTarget = '';
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this.unSub.next(true);
        this.unSub.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Finish the horizontal stepper
     */
    finishHorizontalStepper(): void
    {

        this.matDialog.open(CartDialogComponent, {
            data: {
                items: this.previewCart()
            },
            panelClass: 'cart-dialog'
        }).afterClosed().pipe(takeUntil(this.unSub.asObservable()), switchMap(result => {
            if (result) {
                return this.formService.sendForm(this.formData);
            } else {
                return;
            }
        }))
        .subscribe(data => {
          this.formData.update_time = data.update_time;
        });
    }
    previewCart(): Cart[] {
        const data: Cart[] = [];
        for (const step of this.formData.form) {
            for (const item of step['items']) {
                if (item['value'] >  0) {
                    let price = 0;
                    let options = '';
                    for (const option of item['options']) {
                        if (option['choose']) {
                            price += parseInt(option['price'], 10);
                            options += option['label'] + ' ';
                        }
                    }
                    price += parseInt(item['sizeSelect'], 10);
                    data.push({
                            productName: item['label'],
                            subExtra: options,
                            price: price,
                            count: item['value'],
                            total: parseInt(item['value'], 10) * price,
                        }
                    );
                }
            }
        }
        return data;
    }

}
