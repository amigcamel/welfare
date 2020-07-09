import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'historyCalculator',
  pure: true
})
export class HistoryCalculatorPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): any {
    let sum = 0;
    let count = 0;
    console.log('value: ', value, 'args:', [args]);
    for (const order of value['orders']) {
      count += order.value;
      sum += order.price * order.value;
    }
    return { count,  sum};
  }

}
