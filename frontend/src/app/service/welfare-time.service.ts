import { Injectable } from '@angular/core';
import { CountDown } from '../interface/count-down';

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
}
