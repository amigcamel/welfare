import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { HistoryCalculatorPipe } from '../pipe/history-calculator.pipe';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { WelfareIconDirective } from '../directive/welfare-icon.directive';
import { FooterComponent } from '../component/footer/footer.component';


@NgModule({
  declarations: [
    HistoryCalculatorPipe,
    WelfareIconDirective,
    FooterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    AngularSvgIconModule.forRoot(),
    ZXingScannerModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    AngularSvgIconModule,
    HistoryCalculatorPipe,
    ZXingScannerModule,
    WelfareIconDirective,
    FooterComponent
  ]
})
export class ShareModule { }
