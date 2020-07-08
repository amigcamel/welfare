import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { WelfareTimeService } from "../../../service/welfare-time.service";
import { CountDown } from "../../../interface/count-down";
import { LayoutConfigService } from "../../../service/layout-config.service";
import { WelfareSpinnerService } from '../../../service/welfare-spinner.service';

@Component({
  selector: 'app-coming-soon',
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.scss']
})
export class ComingSoonComponent implements OnInit, OnDestroy {
  public countdownDate: CountDown;
  public isDesktop: boolean = true;
  private setIn: any;
  constructor(
    private router: Router,
    private welfareTimeService: WelfareTimeService,
    public layoutConfigService: LayoutConfigService,
    private welfareSpinnerService: WelfareSpinnerService
  ) {
    this.layoutConfigService.setIsShowToolBar(true);
  }

  ngOnInit(): void {
    this.welfareSpinnerService.showSpinner();
    this.setIn = setInterval(_ => {
      this.countdownDate = this.welfareTimeService.countDown('2020-06-30');
      if (this.setIn) {
        this.welfareSpinnerService.stopSpinner();
      }
    }, 1000);
  }
  goBack(): void {
    this.router.navigateByUrl('/billboard');
  }
  ngOnDestroy(): void {
    clearInterval(this.setIn);
  }

}
