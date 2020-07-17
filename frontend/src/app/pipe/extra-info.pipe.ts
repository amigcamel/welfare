import { Pipe, PipeTransform } from '@angular/core';
import { Item } from '../interface/afternoon-tea-form';
import { Order } from '../interface/history';

@Pipe({
  name: 'extraInfo',
  pure: true
})
export class ExtraInfoPipe implements PipeTransform {
  transform(order: Order, ...args: unknown[]): string {
    console.log(order, 'order');
    if (!!order.options && order.options.length >= 0) {
      let temp = [];
      if (!!order.sugar) {
        temp.push(order.sugar + ' Sugar');
      }
      if (!!order.ice) {
        temp.push(order.ice + ' Ice');
      }
      temp = temp.concat(order.options);
      return temp.join(', ');
    }
  }

}
