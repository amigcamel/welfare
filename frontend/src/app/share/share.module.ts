import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { HistoryCalculatorPipe } from '../pipe/history-calculator.pipe';
import { WelfareIconDirective } from "../directive/welfare-icon.directive";



@NgModule({
  declarations: [
    HistoryCalculatorPipe
    WelfareIconDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    AngularSvgIconModule.forRoot(),
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    AngularSvgIconModule,
    HistoryCalculatorPipe
    WelfareIconDirective,
  ]
})
export class ShareModule { }
