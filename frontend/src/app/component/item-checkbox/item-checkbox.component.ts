import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Item, Options} from '../../interface/afternoon-tea-form';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {LayoutConfigService} from '../../service/layout-config.service';

@Component({
  selector: 'app-item-checkbox',
  templateUrl: './item-checkbox.component.html',
  animations: [
    trigger('openClose', [
      state('open', style({
        height: '*',
      })),
      state('closed', style({
        height: '50px',
      })),
      transition('open <=> closed', [
        animate('.3s ease-in')
      ]),
    ]),
  ],
  styleUrls: ['./item-checkbox.component.scss']
})
export class ItemCheckboxComponent implements OnInit {
  @Input() options: Options;
  @Input() item: Item;
  @Input() isActive: boolean;
  @Output() optionEmitter = new EventEmitter<Item>();
  public collapse = false;
  constructor(public layoutConfigService: LayoutConfigService) { }

  ngOnInit(): void {
  }
  updateItem(select) {
    select.choose = !select.choose;
    this.optionEmitter.emit(this.item);
  }
  toggleItem() {
    this.collapse = !this.collapse;
  }
}
