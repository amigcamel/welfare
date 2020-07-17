import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutConfigService } from '../../../service/layout-config.service';

@Component({
  selector: 'app-no-auth',
  templateUrl: './no-auth.component.html',
  styleUrls: ['./no-auth.component.scss']
})
export class NoAuthComponent implements OnInit {

  constructor(private layoutConfigService: LayoutConfigService,
              private router: Router) {
    this.layoutConfigService.setIsShowToolBar(false);
    this.layoutConfigService.setShowToolBarBottom(true);
    this.layoutConfigService.setShowCartInfo(false);

  }

  ngOnInit(): void {

  }
  goBack() {
      this.router.navigateByUrl('/login');
  }

}
