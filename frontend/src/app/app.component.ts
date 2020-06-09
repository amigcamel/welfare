import { Component } from '@angular/core';
import { LayoutConfigService } from "./service/layout-config.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public layoutConfigService: LayoutConfigService) {
  }
}
