import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { LayoutConfigService } from "../../../service/layout-config.service";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

    historyData: any;
    constructor(private activatedRoute: ActivatedRoute,
                private layoutConfigService: LayoutConfigService) {
      this.layoutConfigService.setIsShowToolBar(true)
    }

  ngOnInit(): void {
      this.historyData = this.activatedRoute.snapshot.data.historyData;
      console.log(this.historyData);
  }

}
