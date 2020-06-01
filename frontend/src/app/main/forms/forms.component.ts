import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { QuestionService } from '../../service/question.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';

import { MatExpansionPanel } from '@angular/material/expansion';
import { FormService } from '../../service/form.service';
import { MatDialog } from '@angular/material/dialog';
import { PhotoDialogComponent } from '../../component/photo-dialog/photo-dialog.component';
import { animate, state, style, transition, trigger } from '@angular/animations';

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
    form: FormGroup;
    steps: any[] = [];
    sum = 0;
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     * @param http
     * @param mock
     * @param formService
     * @param matDialog
     */
    constructor(
        private _formBuilder: FormBuilder,
        private http: HttpClient,
        private  mock: QuestionService,
        private  formService: FormService,
        private  matDialog: MatDialog
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }



    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // this.steps = this.mock.getJSON().map(step => {
        //     const group: any = {};
        //     // @ts-ignore
        //     step['question']['item'].forEach(item => {
        //         group[item.key] = item.required ? new FormControl(item.value || '', Validators.required)
        //             : new FormControl(item.value || '');
        //     });
        //     return {formGroup: new FormGroup(group), form: step};
        // });
        this.steps = this.mock.getJSON();
    }
    print(s): void {
        console.log(s);
    }
    subOne(step, key): void {
        for (const item of this.steps[step]['items']) {
            if (item.key === key) {
                if (item.value > 0) {
                    item.value =  parseInt(item.value) - 1;
                    this.calculatorSum();
                }
            } else {
                item['isOpen'] = false;
            }
        }
    }
    addOne(step, key): void {
        for (const item of this.steps[step]['items']) {
            if (item.key === key) {
                item.value =  parseInt(item.value) + 1;
                this.calculatorSum();
            } else {
                item['isOpen'] = false;
            }
        }

    }
    seeMenu(src): void {
        this.matDialog.open(PhotoDialogComponent, {
            data: {
                imageSource: src
            }
        });
    }
    checkedOption(step, itemKey, optionKey): void {
        for (const item of this.steps[step]['items']) {
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
    calculatorSum(): void {
        this.sum = 0;
        for (let step of this.steps) {
            for (let item of step['items']) {
                let options = 0;
                for (let option of item['options']) {
                    if (option['choose']) {
                        options += parseInt(option['price'])
                    }
                }
                this.sum +=  (options + parseInt(item['sizeSelect'])) * parseInt(item['value']);
            }
        }
    }
    closeAllExpand(): void {
        for (let step of this.steps) {
            for (let item of step['items']) {
                item['isOpen'] = false;
            }
        }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Finish the horizontal stepper
     */
    finishHorizontalStepper(): void
    {
        console.log(this.steps);
    }

    /**
     * Finish the vertical stepper
     */
    finishVerticalStepper(): void
    {
        const result = this.steps.map(item => item['formGroup']['value']);
        this.http.get('/hello').subscribe(data => console.log(data));
    }
    bye(): void {
        this.http.get('/byebye').subscribe(data => console.log(data));
    }
}
