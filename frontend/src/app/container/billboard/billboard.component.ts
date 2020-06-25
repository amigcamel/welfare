import { Component, OnInit } from '@angular/core';
import { LayoutConfigService } from '../../service/layout-config.service';

@Component({
  selector: 'app-billboard',
  templateUrl: './billboard.component.html',
  styleUrls: ['./billboard.component.scss']
})
export class BillboardComponent implements OnInit {

  constructor(private layoutConfigService: LayoutConfigService) {
    this.layoutConfigService.setIsShowToolBar(true);
  }

  ngOnInit(): void {
  }

}
