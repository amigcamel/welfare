import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Item, Options} from '../../interface/afternoon-tea-form';
import {LayoutConfigService} from '../../service/layout-config.service';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-item-option',
  templateUrl: './item-option.component.html',
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
  styleUrls: ['./item-option.component.scss']
})
export class ItemOptionComponent implements OnInit {
  @Input() options: Options;
  @Input() item: Item;
  @Input() isActive: boolean;
  @Output() optionEmitter = new EventEmitter<Item>();
  public collapse = false;
  constructor(public layoutConfigService: LayoutConfigService) { }

  ngOnInit(): void {
  }
  updateChoose() {
    this.optionEmitter.emit(this.item);
  }
  toggleItem() {
    this.collapse = !this.collapse;
  }

}
