import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../service/admin.service';
import { MatDialog } from '@angular/material/dialog';
import { switchMap, tap } from 'rxjs/operators';
import { DialogComponent } from '../../../component/dialog/dialog.component';

@Component({
  selector: 'app-qrcode-scanner',
  templateUrl: './qrcode-scanner.component.html',
  styleUrls: ['./qrcode-scanner.component.scss']
})
export class QrcodeScannerComponent implements OnInit {

  constructor(private adminService: AdminService, private matDialog: MatDialog) { }
  info: string;
  ngOnInit(): void {
  }

  showOrderDetail(hash) {
    this.adminService.updateByQr(hash).pipe(
      switchMap(data => {
        return this.matDialog.open(DialogComponent, {
          data: {
            contentType: 'oderCollected',
            dialogType: 'tipDialog',
            title: 'Order Detail',
            positiveBtn: 'Okay',
            orders: data[0]
          },
          panelClass: 'form-dialog'
        }).afterClosed();
      })).subscribe();
  }

}
