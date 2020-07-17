import { Pipe, PipeTransform } from '@angular/core';
import { HistoryPipe, Order, Orders } from '../interface/history';

@Pipe({
  name: 'historyCalculator',
  pure: true
})
export class HistoryCalculatorPipe implements PipeTransform {
  transform(value: Orders, ...args: unknown[]): HistoryPipe {
    let sum = 0;
    let count = 0;
    for (const order of value.orders) {
      count += order.value;
      sum += order.price * order.value;
    }
    return { count,  sum};
  }

}
