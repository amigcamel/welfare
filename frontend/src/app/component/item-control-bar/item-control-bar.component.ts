import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Item } from '../../interface/afternoon-tea-form';

@Component({
  selector: 'app-item-control-bar',
  templateUrl: './item-control-bar.component.html',
  styleUrls: ['./item-control-bar.component.scss']
})
export class ItemControlBarComponent implements OnInit {

  constructor() { }
  @Input() public item: Item;
  @Output() public toggleCollapse = new EventEmitter<any>();
  @Output() public updateItem = new EventEmitter<Item>();
  public itemPriceLabel: string;
  ngOnInit(): void {
    this.getPriceLabel(this.item);
  }

  public handleCollapse() {
    console.log('click');
    this.toggleCollapse.emit();
  }

  public subOne(e) {
    e.stopPropagation();
    this.item.value = this.item.value > 0 ? this.item.value - 1 : this.item.value;
    this.updateItem.emit(this.item);
  }

  public addOne(e) {
    e.stopPropagation();
    this.item.value = this.item.value + 1;
    this.updateItem.emit(this.item);
  }

  private getPriceLabel(item: Item) {
    const result = [];
    for (const option of item.options) {
      if (option.optionKey === 'size') {
        for (const selection of option.radioSelections) {
          result.push((option.radioSelections.length > 1 ? `${selection.selectionLabel} :` : '') + selection.price);
        }
      }
    }
    this.itemPriceLabel = result.join(' | ');
  }
}
