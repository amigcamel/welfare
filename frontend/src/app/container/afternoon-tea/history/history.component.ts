import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutConfigService } from '../../../service/layout-config.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../component/dialog/dialog.component';
import { Orders } from '../../../interface/history';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  historyData: Orders[];
  constructor(private activatedRoute: ActivatedRoute,
              private matDialog: MatDialog,
              private router: Router,
              public layoutConfigService: LayoutConfigService) {
    this.layoutConfigService.setIsShowToolBar(true);
    this.layoutConfigService.setShowToolBarBottom(true);
    this.layoutConfigService.setShowCartInfo(false);
  }

  ngOnInit(): void {
    this.historyData = this.activatedRoute.snapshot.data.historyData;
  }
  public showExtra(order): string {
    if (!!order.options && order.options.length > 0) {
      return order.sugar + ' Sugar, ' + order.ice + ' Ice, ' + order.options.join(', ');
    }
  }
  showQRCode(e, qr) {
    e.stopPropagation();
    this.matDialog.open(DialogComponent, {
      data: {
        contentType: 'qr',
        dialogType: 'tipDialog',
        title: 'QrCode',
        qr,
        positiveBtn: 'Ok'
      },
      panelClass: 'form-dialog'
    });
  }
  navigateForm() {
    this.router.navigateByUrl('/afternoon-tea/form');
  }
}
