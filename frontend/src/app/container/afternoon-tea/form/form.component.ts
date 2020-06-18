import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from "@angular/animations";
import { of, Subject } from "rxjs";
import { CountDown, CountExpiration } from "../../../interface/count-down";
import { AfternoonTeaForm, CheckBoxSelection, Form, Item } from "../../../interface/afternoon-tea-form";
import { FormService } from "../../../service/form.service";
import { MatDialog } from "@angular/material/dialog";
import { WelfareTimeService } from "../../../service/welfare-time.service";
import { ActivatedRoute, Router } from "@angular/router";
import { PhotoDialogComponent } from "../../../component/photo-dialog/photo-dialog.component";
import { DialogComponent } from "../../../component/dialog/dialog.component";
import { CartDialogComponent } from "../../../component/cart-dialog/cart-dialog.component";
import { switchMap, takeUntil } from "rxjs/operators";
import { Cart } from "../../../interface/cart";
import * as data from "../../../service/mock2.json";
import { LayoutConfigService } from "../../../service/layout-config.service";
import { ViewportScroller } from "@angular/common";
@Component({
  selector: 'app-form',
  animations: [
    trigger('openClose', [
      state('open', style({
        height: '*',
      })),
      state('closed', style({
        height: '75px',
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
  @ViewChild('container', {static: true}) container: ElementRef;
  public sum = 0;
  public filterTarget = '';
  public expiration: CountExpiration;
  public formData: AfternoonTeaForm;
  public isDesktop;
  public currentForm = 0;
  // Private
  private unSubscribe = new Subject<boolean>();
  private setInt: any;
  constructor(
    private formService: FormService,
    private matDialog: MatDialog,
    private welfareTimeService: WelfareTimeService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private viewportScroller: ViewportScroller,
    public layoutConfigService: LayoutConfigService
  ) { }

  ngOnInit(): void {
    this.formData = this.activatedRoute.snapshot.data.formData;
    // this.formData = data['default'];
    if (this.formData.user === 'default') {
      this.initialFormData();
    }
    this.setInt = setInterval(_ => {
      this.expiration = this.welfareTimeService.countExpiration(this.formData.expiration);
    }, 1000);
    this.layoutConfigService.isDesktop$.pipe(takeUntil(this.unSubscribe.asObservable())).subscribe(state => {
      this.isDesktop = state;
    })
    this.calculatorSum();
  }
  nextPage() {
    this.closeAllCollapse(this.formData.form[this.currentForm]);
    if (this.currentForm + 1 < this.formData.form.length) {
      this.container.nativeElement.scrollTop = 0
    }
    this.currentForm = this.currentForm + 1 < this.formData.form.length ? this.currentForm + 1 : this.currentForm;

  }
  previousPage() {
    this.closeAllCollapse(this.formData.form[this.currentForm]);
    if (this.currentForm - 1 >= 0) {
      this.container.nativeElement.scrollTop = 0
    }
    this.currentForm = this.currentForm - 1 < 0 ? this.currentForm : this.currentForm -1;

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
  }

  public filterText(target: string): boolean {
    if (this.filterTarget === '') {
      return true;
    } else {
      const regexp = new RegExp(this.filterTarget, 'gi');
      return regexp.test(target);
    }
  }

  public subOnFlow(form: Form, target: Item, event: Event): void {
    event.stopPropagation()
    target = this.subOne(target);
    this.calculatorSum();
    target.collapse = target.value !== 0;
  }

  private subOne(item: Item): Item {
    item.value = item.value > 0 ? item.value - 1 : item.value;
    return item
  }

  private addOne(item: Item): Item {
    item.value = item.value + 1;
    return item
  }

  public addOneFlow(form: Form, target: Item, event: Event): void {
    event.stopPropagation()
    target.collapse = true;
    target = this.addOne(target);
    this.calculatorSum();
    if (this.sum > this.formData.budget) {
      target = this.subOne(target);
      this.calculatorSum();
    }
  }

  public seeMenu(src: string): void {
    this.matDialog.open(PhotoDialogComponent, {
      data: {
        imageSource: src
      },
      panelClass: 'photo-dialog'
    });
  }

  public checkedOption(selection: CheckBoxSelection): void {
    selection.choose = !selection.choose;
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
          title: 'Over Budget',
          errorMessage: `Your Budget: ${this.formData.budget}<br> Current: ${this.sum}`
        },
        panelClass: 'form-dialog'
      });
    }
  }
  public toggleCollapse(item: Item){
    if (item.value === 0 && this.isDesktop ) {
      item.collapse = false;
    } else {
      item.collapse = !item.collapse;
    }
  }

  public closeAllCollapse(form: Form): void {
    for (const item of form.items) {
      item.collapse = false;
    }
    this.filterTarget = '';
  }

  finishOrder(): void
  {
    if (this.sum > this.formData.budget) {
      this.matDialog.open(DialogComponent, {
        data: {
          title: 'Over Budget',
          errorMessage: `Your Budget: ${this.formData.budget}<br> Current: ${this.sum}`
        },
        panelClass: 'form-dialog'
      });
      return;
    } else if (this.sum === 0) {
      this.matDialog.open(DialogComponent, {
        data: {
          title: 'No choose',
          errorMessage: `Your Order is empty`
        },
        panelClass: 'form-dialog'
      });
      return;
    }

    for (const form of this.formData.form) {
      this.closeAllCollapse(form);
    }
    this.matDialog.open(CartDialogComponent, {
      data: {
        items: this.previewCart(),
        total: this.sum
      },
      panelClass: 'cart-dialog'
    }).afterClosed().pipe(takeUntil(this.unSubscribe.asObservable()), switchMap(result => {
      if (result) {
        return this.formService.sendForm(this.formData);
      } else {
        return of(null);
      }
    }))
      .subscribe(data => {
        if (!!data) {
          this.formData.update_time = data.update_time;
          this.router.navigateByUrl('/afternoon-tea/history');
        }
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
  getPriceLabel(item: Item): string {
    let result = [];
    for (let option of item.options) {
      if (option.optionKey === 'size') {
        for(let selection of option.radioSelections) {
          result.push((option.radioSelections.length > 1 ? `${selection.selectionLabel} :` : "") + selection.price)
        }
      }
    }
    return result.join(" | ");
  }

  ngOnDestroy() {
    clearInterval(this.setInt);
    this.unSubscribe.next(true);
    this.unSubscribe.complete();
  }
}
