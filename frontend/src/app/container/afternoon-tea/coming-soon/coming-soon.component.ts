import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WelfareTimeService } from '../../../service/welfare-time.service';
import { ComingSoonInfo, CountDown } from '../../../interface/count-down';
import { LayoutConfigService } from '../../../service/layout-config.service';
import { WelfareSpinnerService } from '../../../service/welfare-spinner.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-coming-soon',
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.scss']
})
export class ComingSoonComponent implements OnInit, OnDestroy {
  public countdownDate: CountDown;
  public comingSoonInfo: ComingSoonInfo;
  private setIn: any;
  constructor(
    private router: Router,
    private welfareTimeService: WelfareTimeService,
    public layoutConfigService: LayoutConfigService,
    private welfareSpinnerService: WelfareSpinnerService
  ) {
    this.layoutConfigService.setIsShowToolBar(true);
    this.layoutConfigService.setShowToolBarBottom(false);
    this.layoutConfigService.setShowCartInfo(false);
  }

  ngOnInit(): void {
    this.welfareSpinnerService.showSpinner();
    this.welfareTimeService.getInfo().pipe(take(1)).subscribe(data => {
      this.comingSoonInfo = data;
      this.setIn = setInterval(_ => {
        this.countdownDate = this.welfareTimeService.countDown(this.comingSoonInfo.date);
        if (this.setIn) {
          this.welfareSpinnerService.stopSpinner();
        }
      }, 1000);
    });

  }
  goBack(): void {
    this.router.navigateByUrl('/billboard');
  }
  ngOnDestroy(): void {
    clearInterval(this.setIn);
  }

}
