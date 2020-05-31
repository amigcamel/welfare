import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormService {

    constructor() {
    }

    private isValid(value): boolean {
        return !isNaN(parseInt(value))
    }
    private lessZero(value): boolean {
        return value < 0
    }
    private isExceed(order, value, sum) {

    }
}
