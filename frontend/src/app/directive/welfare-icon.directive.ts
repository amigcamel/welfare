import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appWelfareIcon]'
})
export class WelfareIconDirective implements AfterViewInit{
  @Input() size: string;
  @Input() iconName: string;
  constructor(private el: ElementRef) {
  }
  ngAfterViewInit() {
    this.el.nativeElement.style.display = "block";
    this.el.nativeElement.style.width = "32px";
    this.el.nativeElement.style.height = "32px";
    this.el.nativeElement.style.backgroundImage = "url(/assets/icons/"+ this.iconName + ".svg)";
  }

}
