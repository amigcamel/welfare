import { Component, OnDestroy, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from "@angular/animations";
import { Subject } from "rxjs";
import { CountDown } from "../../../interface/count-down";
import { AfternoonTeaForm } from "../../../interface/afternoon-tea-form";
import { FormService } from "../../../service/form.service";
import { MatDialog } from "@angular/material/dialog";
import { WelfareTimeService } from "../../../service/welfare-time.service";
import { ActivatedRoute } from "@angular/router";
import { PhotoDialogComponent } from "../../../component/photo-dialog/photo-dialog.component";
import { DialogComponent } from "../../../component/dialog/dialog.component";
import { CartDialogComponent } from "../../../component/cart-dialog/cart-dialog.component";
import { switchMap, takeUntil } from "rxjs/operators";
import { Cart } from "../../../interface/cart";
import * as data from "../../../service/mock2.json";
@Component({
  selector: 'app-form',
  animations: [
    trigger('openClose', [
      state('open', style({
        height: '*',
      })),
      state('closed', style({
        height: '70px',
      })),
      transition('open <=> closed', [
        animate('.5s ease-in')
      ]),
    ]),
  ],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, OnDestroy {
  public sum = 0;
  public filterTarget = '';
  public expiration: CountDown;
  public formData: AfternoonTeaForm;
  // Private
  private unSubscribe = new Subject<boolean>();
  private setInt: any;
  constructor(
    private formService: FormService,
    private matDialog: MatDialog,
    private welfareTimeService: WelfareTimeService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // this.formData = this.activatedRoute.snapshot.data.formData;
    this.formData = data['default'];
    console.log(this.formData, 'before')
    if (this.formData.user === 'default') {
      this.initialFormData();
    }
    this.setInt = setInterval(_ => {
      this.expiration = this.welfareTimeService.countDown(this.formData.expiration);
    }, 1000);
  }
  private initialFormData(){
    this.formData.form.forEach(form => {
      form.items.forEach(item => {
        item.options.forEach(option => {
          if (!!option.radioSelections && option.radioSelections.length > 0) {
            const key = option.optionKey
            item.selections = Object.assign({...item.selections},
              {[key]: option.radioSelections[0].value})
          }
        })
      })
    })
    console.log(this.formData, 'after');
  }
  public filterText(target: string): boolean {
    if (this.filterTarget === '') {
      return true;
    } else {
      const regexp = new RegExp(this.filterTarget, 'gi');
      return regexp.test(target);
    }
  }
  public subOne(index: number, key: string): void {
    for (let item of this.formData.form[index].items) {
      if (item.itemKey === key) {
        if (item.value > 0) {
          item.value =  item.value - 1;
          this.calculatorSum();
        }
      } else {
        item.collapse = false;
      }
    }
  }
  public addOne(index: number, key: string): void {
    for (let item of this.formData.form[index].items) {
      if (item.itemKey === key) {
        item.value =  item.value + 1;
        this.calculatorSum();
        if (this.sum > this.formData.budget) {
          item.value =  item.value - 1;
          this.calculatorSum();
        }
      } else {
        item.collapse = false;
      }
    };
  }
  public seeMenu(src: string): void {
    this.matDialog.open(PhotoDialogComponent, {
      data: {
        imageSource: src
      },
      panelClass: 'photo-dialog'
    });
  }
  public checkedOption(index: number, itemKey: string, optionKey: string, selectionKey: string): void {
    for (let item of this.formData.form[index].items) {
      if (item.itemKey === itemKey) {
        for (let option of item.options) {
          if (option.optionKey === optionKey) {
            if (!!option.checkBoxOptions) {
              for (let select of option.checkBoxOptions) {
                if (select.selectionKey === selectionKey) {
                  console.log(selectionKey)
                  select.choose = !select.choose
                }
              }
            }
          }
        }
      }
    }
    this.calculatorSum();
  }
  public calculatorSum(): void {
    this.sum = 0;
    for (let form of this.formData.form) {
      for (let item of form.items) {
        let extraValue = 0;
        for (let option of item.options) {
          if (!!option.checkBoxOptions){
            for (let select of option.checkBoxOptions) {
              if (select.choose) {
                extraValue += select.price;
              }
            }
          }
        }
        this.sum += item.value * (item.selections['size'] + extraValue)
      }
    }
    if (this.sum > this.formData.budget) {
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
    for (let form of this.formData.form) {
      for (const item of form.items) {
        item.collapse = false;
      }
    }
    this.filterTarget = '';
  }
  finishHorizontalStepper(): void
  {

    this.matDialog.open(CartDialogComponent, {
      data: {
        items: this.previewCart()
      },
      panelClass: 'cart-dialog'
    }).afterClosed().pipe(takeUntil(this.unSubscribe.asObservable()), switchMap(result => {
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
    for (const form of this.formData.form) {
      for (const item of form.items) {
        if (item['value'] >  0) {
          let price = 0;
          let optionList = '';
          for (const option of item.options) {
            if (!!option.checkBoxOptions){
              for (let select of option.checkBoxOptions) {
                if (select.choose) {
                  price += select.price;
                  optionList += select.selectionLabel;
                }
              }
            }
          }
          price += item.selections['size']
          data.push({
              productName: item.itemLabel,
              subExtra: optionList,
              price: price,
              count: item.value,
              total: item.value * price,
            }
          );
        }
      }
    }
    return data;
  }

  ngOnDestroy() {
    clearInterval(this.setInt);
    this.unSubscribe.next(true);
    this.unSubscribe.complete();
  }
}
