import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LayoutConfigService } from '../../../service/layout-config.service';
import { MatDialog } from "@angular/material/dialog";
import { QrcodeDialogComponent } from "../../../component/qrcode-dialog/qrcode-dialog.component";
import { DialogComponent } from "../../../component/dialog/dialog.component";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

    historyData: any;
    constructor(private activatedRoute: ActivatedRoute,
                private matDialog: MatDialog,
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
  showQRCode(e:Event, qr) {
      e.stopPropagation()
    this.matDialog.open(DialogComponent, {
      data: {
        contentType: 'qr',
        dialogType: 'tipDialog',
        title: 'QrCode',
        qr: qr,
        positiveBtn: 'Ok'
      },
      panelClass: 'form-dialog'
    })
  }
}
