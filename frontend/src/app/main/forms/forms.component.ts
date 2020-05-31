import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { QuestionService } from '../../service/question.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import {FormService} from "../../service/form.service";
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "../../component/dialog/dialog.component";
import { PhotoDialogComponent } from "../../component/photo-dialog/photo-dialog.component";

@Component({
    selector   : 'forms',
    templateUrl: './forms.component.html',
    styleUrls  : ['./forms.component.scss']
})
export class FormsComponent implements OnInit, OnDestroy
{
    form: FormGroup;
    steps: any[] = [];
    sum: number = 0;
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
    subOne(step, key) {
        for(let item of this.steps[step]['items']) {
            if (item.key === key && item.value > 0) {
                item.value =  parseInt(item.value) - 1
                this.sum -= parseInt(item.price)
            }
        }
    }
    addOne(step, key) {
        // this.matDialog.open(DialogComponent, {
        //     data: {
        //         errorMessage: 'stupid control'
        //     }
        // })
        for(let item of this.steps[step]['items']) {
            if (item.key === key ) {
                item.value =  parseInt(item.value) + 1
                this.sum += parseInt(item.price)
            }
        }

    }
    seeMenu(src) {
        this.matDialog.open(PhotoDialogComponent, {
            data: {
                imageSource: src
            }
        })
    }
    checkedOption(step, itemKey, optionKey) {
        for(let item of this.steps[step]['items']) {
            if (item.key === itemKey) {
                for (let option of item.options) {
                    if (option.key === optionKey) {
                        if (option.choose) {
                            console.log(option.choose)
                            this.sum -= parseInt(option.price)
                            option.choose = false;
                            console.log(option.choose)
                        } else {
                            console.log(option.choose)
                            this.sum += parseInt(option.price)
                            option.choose = true;
                        }
                    }
                }
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
        console.log(this.steps)
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
