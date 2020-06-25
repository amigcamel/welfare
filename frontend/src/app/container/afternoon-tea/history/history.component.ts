import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LayoutConfigService } from '../../../service/layout-config.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

    historyData: any;
    constructor(private activatedRoute: ActivatedRoute,
                public layoutConfigService: LayoutConfigService) {
      this.layoutConfigService.setIsShowToolBar(true);
    }

  ngOnInit(): void {
      this.historyData = this.activatedRoute.snapshot.data.historyData;
      console.log(this.historyData);
  }
  public showExtra(order): string {
      if (!!order.options && order.options.length > 0) {
      return order.sugar + ' Sugar, ' + order.ice + ' Ice, ' + order.options.join(', ');
      }
  }
}
