import { Component } from '@angular/core';
import { LayoutConfigService } from './service/layout-config.service';
import { NavigationEnd, Router } from '@angular/router';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { WelfareSpinnerService } from './service/welfare-spinner.service';

declare let gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  resize$ = fromEvent(window, 'resize');
  constructor(public layoutConfigService: LayoutConfigService,
              private router: Router,
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd){
        gtag('config', 'UA-169387880-1',
          {
            page_path: event.urlAfterRedirects
          }
        );
      }
    });
    window.innerWidth < 600 ? this.layoutConfigService.setIsDesktop(false) : this.layoutConfigService.setIsDesktop(true);
    this.resize$.pipe(debounceTime(200)).subscribe(e => {
      e.target['innerWidth']< 376 ?
        this.layoutConfigService.setIsDesktop(false) : this.layoutConfigService.setIsDesktop(true);
    });
  }
}
