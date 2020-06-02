import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as data from './mock.json';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  constructor() { }
  getJSON(): [] {
    return data['default'][0]['form'];
  }
  getBudget(): number{
      return data['default'][0]['budget'];
  }
}
