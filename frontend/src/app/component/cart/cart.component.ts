import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormService } from '../../service/form.service';
import { LayoutConfigService } from '../../service/layout-config.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  public budget: number;
  public sum: number;
  private unSub = new Subject<boolean>();
  constructor(private formService: FormService, public layoutConfigService: LayoutConfigService) { }

  ngOnInit(): void {
    this.formService.cartInfo$.pipe(takeUntil(this.unSub.asObservable())).subscribe(
      info => {
        this.budget = info.budget;
        this.sum = info.sum;
      }
    );
  }
  openPreview() {
    this.formService.emitCartDialog(true);
  }
  ngOnDestroy() {
    this.unSub.next(true);
    this.unSub.complete();
  }

}
