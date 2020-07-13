import { Component, OnInit } from '@angular/core';
import { FormService } from '../../service/form.service';
import { LayoutConfigService } from '../../service/layout-config.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  public budget: number;
  public sum: number;
  public isShow: boolean;
  constructor(private formService: FormService, public layoutConfigService: LayoutConfigService) { }

  ngOnInit(): void {
    this.formService.cartInfo$.pipe().subscribe(
      info => {
        this.budget = info['budget'];
        this.sum = info['sum'];
      }
    );
  }
  openPreview() {
    this.formService.emitCartDialog(true);
  }

}
