import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../component/dialog/dialog.component';
import { Router } from '@angular/router';
import { AdminService } from '../../service/admin.service';
import { switchMap, take } from 'rxjs/operators';
import { of } from 'rxjs';
import { WelfareWebsocketService } from '../../service/welfare-websocket.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor(private matDialog: MatDialog, private router: Router, private adminService: AdminService,
              private welfareWebsocketService: WelfareWebsocketService) { }
  orders: any;
  showOrder = [];
  selectTab = 'All';
  ngOnInit(): void {
    this.adminService.getAllOrder().pipe(take(1)).subscribe(
      data => {
        this.orders = data;
        this.filterOrder(this.selectTab);
      }
    );
    this.welfareWebsocketService.setWSEndpoint(localStorage.getItem('token'));
    this.welfareWebsocketService.getNewWebSocket().pipe(
      switchMap( action => {
       return this.adminService.getAllOrder();
      })
    ).subscribe(data => {
      this.orders = data;
      this.filterOrder(this.selectTab);
    });
  }
  public onSelectTab(tab: string) {
    this.selectTab = tab;
    this.filterOrder(tab);
  }
  public filterOrder(type) {
    if (type === 'Not Get'){
      this.showOrder = this.orders.filter(v => !v.status);
    } else if (type === 'Get') {
      this.showOrder = this.orders.filter(v => v.status);
    } else if (type === 'All') {
      console.log('get all', this.orders);
      this.showOrder = this.orders;
    }
  }
  public handleStatus(target) {
    this.matDialog.open(DialogComponent, {
      data: {
        contentType: 'warning',
        dialogType: 'checkDialog',
        title: 'Make Change',
        errorMessage: 'You wont to change this status?',
        positiveBtn: 'Yes',
        negativeBtn: 'No'
      },
      panelClass: 'form-dialog'
    }).afterClosed().pipe(switchMap(result => {
      if (result) {
        console.log(target);
        return this.adminService.updateOrder(target.email, target.collected);
      }
      return of(false);
    })).subscribe(result => {
      if (result) {
        this.orders.forEach(item => {
          if (item.orderId === target.orderId) {
            item.collected = !item.collected;
          }
        });
      }
      this.filterOrder(this.selectTab);
    });
  }
  public qrScanner() {
    this.router.navigateByUrl('/admin/qr-scanner');
  }

  public showOrderDetail(user) {
    this.adminService.getOrder(user).pipe(switchMap(data => {
      console.log(data);
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
