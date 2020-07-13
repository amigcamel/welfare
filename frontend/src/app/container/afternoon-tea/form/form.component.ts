import { AfterContentInit, AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { of, Subject } from 'rxjs';
import { CountExpiration } from '../../../interface/count-down';
import { AfternoonTeaForm, CheckBoxSelection, Form, Item } from '../../../interface/afternoon-tea-form';
import { FormService } from '../../../service/form.service';
import { MatDialog } from '@angular/material/dialog';
import { WelfareTimeService } from '../../../service/welfare-time.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from '../../../component/dialog/dialog.component';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Cart } from '../../../interface/cart';
import { LayoutConfigService } from '../../../service/layout-config.service';
import { ViewportScroller } from '@angular/common';
import { faExclamationTriangle, faShoppingBag } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-form',
  animations: [
    trigger('openClose', [
      state('open', style({
        height: '*',
      })),
      state('closed', style({
        height: '{{minHeight}}',
      }), {params: {minHeight: '36px'}}),
      transition('open <=> closed', [
        animate('.5s ease-in')
      ]),
    ]),
  ],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})

export class FormComponent implements OnInit, OnDestroy, AfterViewInit, AfterContentInit {
  @ViewChild('container', {static: true}) container: ElementRef;
  public sum: number;
  public filterTarget = '';
  public expiration: CountExpiration;
  public formData: AfternoonTeaForm;
  public isDesktop: boolean;
  public currentForm = 0;
  public minHeight: string;
  // Private
  private unSubscribe = new Subject<boolean>();

  constructor(
    private formService: FormService,
    private matDialog: MatDialog,
    private welfareTimeService: WelfareTimeService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private viewportScroller: ViewportScroller,
    public layoutConfigService: LayoutConfigService
  ) {
    this.layoutConfigService.setShowCartInfo(true);
    this.layoutConfigService.setShowToolBarBottom(true);
    this.layoutConfigService.setIsShowToolBar(true);
  }

  ngOnInit(): void {
    this.formData = this.activatedRoute.snapshot.data.formData;
    // this.formData = data['default'];
    if (this.formData.user === 'default') {
      this.initialFormData();
    }

    this.layoutConfigService.isDesktop$.pipe(takeUntil(this.unSubscribe.asObservable())).subscribe(check => {
      this.isDesktop = check;
      this.minHeight = this.isDesktop ? '45px' : '47px';
    });
    this.formService.cartDialog$.pipe(takeUntil(this.unSubscribe.asObservable())).subscribe(
      _ => this.openPreview()
    );
  }
  ngAfterViewInit() {

  }
  ngAfterContentInit() {
    this.calculatorSum();
  }

  nextPage() {
    this.closeAllCollapse(this.formData.form[this.currentForm]);
    if (this.currentForm + 1 < this.formData.form.length) {
      this.container.nativeElement.scrollTop = 0;
    }
    this.currentForm = this.currentForm + 1 < this.formData.form.length ? this.currentForm + 1 : this.currentForm;

  }

  previousPage() {
    this.closeAllCollapse(this.formData.form[this.currentForm]);
    if (this.currentForm - 1 >= 0) {
      this.container.nativeElement.scrollTop = 0;
    }
    this.currentForm = this.currentForm - 1 < 0 ? this.currentForm : this.currentForm - 1;

  }
  private initialFormData(){
    this.formData.form.forEach(form => {
      form.items.forEach(item => {
        item.options.forEach(option => {
          if (!!option.radioSelections && option.radioSelections.length > 0) {
            const key = option.optionKey;
            item.selections = Object.assign({...item.selections},
              {[key]: option.radioSelections[0].value});
          }
        });
      });
    });
  }
  public handleFilterTarget(target) {
    this.filterTarget = target;
  }
  public filterText(target: string): boolean {
    if (this.filterTarget === '') {
      return true;
    } else {
      const regexp = new RegExp(this.filterTarget, 'gi');
      return regexp.test(target);
    }
  }

  public handleItem(item, newItem) {
    item = newItem;
    this.calculatorSum();
    if (this.sum > this.formData.budget) {
      item.value -= 1;
      this.calculatorSum();
      return;
    }
    item.collapse = item.value !== 0;
  }

  public seeMenu(src: string): void {
    this.matDialog.open(DialogComponent, {
      data: {
        contentType: 'image',
        imageSource: src
      },
      panelClass: 'photo-dialog'
    });
  }
  updateItem(newItem, oldItem) {
    console.log(newItem, oldItem);
    oldItem = newItem;
    this.calculatorSum();
  }

  public checkedOption(selection: CheckBoxSelection): void {
    selection.choose = !selection.choose;
    this.calculatorSum();
  }

  public calculatorSum(): void {
    this.sum = 0;
    for (const form of this.formData.form) {
      for (const item of form.items) {
        let extraValue = 0;
        for (const option of item.options) {
          if (!!option.checkBoxOptions){
            for (const select of option.checkBoxOptions) {
              if (select.choose) {
                extraValue += select.price;
              }
            }
          }
        }
        this.sum += item.value * (item.selections.size + extraValue);
      }
    }
    if (this.sum > this.formData.budget) {
      this.matDialog.open(DialogComponent, {
        data: {
          contentType: 'warning',
          dialogType: 'tipDialog',
          faIcon: faExclamationTriangle,
          title: 'Over Budget',
          errorMessage: 'Sorry, but you have to modify your order.',
          positiveBtn: 'Ok'
        },
        panelClass: 'form-dialog'
      });
    }
    setTimeout(() => {
      this.formService.setCartInfo({
        budget: this.formData.budget,
        sum: this.sum
      });
    }, 100);
  }
  public toggleCollapse(item: Item){
    console.log('toggle');
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

  finishOrder(): void {
    if (this.sum > this.formData.budget) {
      this.matDialog.open(DialogComponent, {
        data: {
          contentType: 'warning',
          dialogType: 'tipDialog',
          faIcon: faExclamationTriangle,
          title: 'Over Budget',
          errorMessage: 'Sorry, but you have to modify your order.',
          positiveBtn: 'Got it'
        },
        panelClass: 'form-dialog'
      });
      return;
    } else if (this.sum === 0) {
      this.matDialog.open(DialogComponent, {
        data: {
          contentType: 'warning',
          dialogType: 'tipDialog',
          faIcon: faExclamationTriangle,
          title: 'Nothing selected',
          errorMessage: 'Please at least select an item.',
          positiveBtn: 'Got it'
        },
        panelClass: 'form-dialog'
      });
      return;
    }

    for (const form of this.formData.form) {
      this.closeAllCollapse(form);
    }
    this.matDialog.open(DialogComponent, {
      data: {
        contentType: 'cart',
        dialogType: 'checkDialog',
        faIcon: faShoppingBag,
        title: 'Order',
        positiveBtn: 'Confirm',
        negativeBtn: 'Cancel',
        items: this.previewCart(),
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
        if (item.value >  0) {
          let price = 0;
          let optionList = '';
          for (const option of item.options) {
            if (!!option.checkBoxOptions){
              for (const select of option.checkBoxOptions) {
                if (select.choose) {
                  price += select.price;
                  optionList += select.selectionLabel;
                }
              }
            }
          }
          price += item.selections.size;
          data.push({
              productName: item.itemLabel,
              subExtra: optionList,
              price,
              count: item.value,
              total: item.value * price,
            }
          );
        }
      }
    }
    return data;
  }
  openPreview() {
    this.matDialog.open(DialogComponent, {
      data: {
        contentType: 'cart',
        dialogType: 'tipDialog',
        faIcon: faShoppingBag,
        title: 'Order',
        positiveBtn: 'Confirm',
        items: this.previewCart(),
      },
      panelClass: 'cart-dialog'
    });
  }
  ngOnDestroy() {
    this.unSubscribe.next(true);
    this.unSubscribe.complete();
  }
  print(e) {
    console.log(e);
  }
}
