import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  @Input() customBackGroundColor: string;
  @ViewChild('container', { static: true }) container: ElementRef;
  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    if (!!this.customBackGroundColor) {
      this.renderer.setStyle(this.container.nativeElement, 'background-color', this.customBackGroundColor);
    }
  }

}
