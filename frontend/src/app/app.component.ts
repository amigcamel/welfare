import { Component } from '@angular/core';
import { LayoutConfigService } from "./service/layout-config.service";
import { NavigationEnd, Router } from "@angular/router";

declare let gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public layoutConfigService: LayoutConfigService, private router: Router) {
    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd){
        gtag('config', 'UA-169387880-1',
          {
            'page_path': event.urlAfterRedirects
          }
        );
      }
    })
  }
}
