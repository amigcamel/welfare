import { Injectable } from '@angular/core';
import { CountDown, CountExpiration } from '../interface/count-down';

@Injectable({
  providedIn: 'root'
})
export class WelfareTimeService {

  constructor() { }
  countDown(dueDate: string): CountDown {
      const now = new Date().getTime();
      const timeLeft = new Date(dueDate).getTime() - now;

      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      return {days, hours, minutes, seconds};
  }
  countExpiration(dueDate: string): CountExpiration {
    const now = new Date().getTime();
    const timeLeft = new Date(dueDate).getTime() - now;
    if (timeLeft >= 1000 * 60 * 60 * 24) {
      return { unit: 'Days', value: Math.floor(timeLeft / (1000 * 60 * 60 * 24))};
    } else if (timeLeft >= 1000 * 60 * 60 * 24) {
      return { unit: 'Hours', value: Math.floor(timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)};
    } else if (timeLeft >= 1000 * 60 * 60) {
      return { unit: 'Minutes', value: Math.floor(timeLeft % (1000 * 60 * 60)) / (1000 * 60) }
    } else if (timeLeft >= 1000 * 60){
      return { unit: 'Minutes', value: Math.floor(timeLeft % (1000 * 60) / 1000 )}
    }
    return { unit: 'Time is Over', value: 0 }
  }
}
