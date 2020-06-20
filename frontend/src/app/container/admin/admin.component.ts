import { Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "../../component/dialog/dialog.component";
import { Router } from "@angular/router";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor(private matDialog: MatDialog, private router: Router) { }
  orders = [
    {
      sid: 410,
      name: 'hunter',
      orderId: '5eed882184bc4e26a26d1b2f1',
      status: false
    },
    {
      sid: 411,
      name: 'hunter',
      orderId: '5eed882184bc4e26a26d1b2f2',
      status: false
    },
    {
      sid: 412,
      name: 'hunter',
      orderId: '5eed882184bc4e26a26d1b2f3',
      status: false
    },
    {
      sid: 413,
      name: 'hunter',
      orderId: '5eed882184bc4e26a26d1b2f4',
      status: true
    },
    {
      sid: 414,
      name: 'hunter',
      orderId: '5eed882184bc4e26a26d1b2f5',
      status: true
    },
    {
      sid: 415,
      name: 'hunter',
      orderId: '5eed882184bc4e26a26d1b2f6',
      status: true
    },{
      sid: 416,
      name: 'hunter',
      orderId: '5eed882184bc4e26a26d1b2f7',
      status: false
    },
    {
      sid: 417,
      name: 'hunter',
      orderId: '5eed882184bc4e26a26d1b2f8',
      status: false
    }
  ]
  showOrder = [];
  selectTab = 'All'
  ngOnInit(): void {
    this.onSelectTab('All');
  }
  public onSelectTab(tab: string) {
    this.selectTab = tab;
    this.filterOrder(tab);
  }
  public filterOrder(type) {
    if (type === 'Not Get'){
      this.showOrder = this.orders.filter(v => !v.status)
    } else if (type === 'Get') {
      this.showOrder = this.orders.filter(v => v.status)
    } else if (type === 'All') {
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
        negativeBtn: "No"
      },
      panelClass: 'form-dialog'
    }).afterClosed().subscribe(result => {
      if (result) {
        this.orders.forEach(item => {
          if (item.orderId === target.orderId) {
            item.status = !item.status
          }
        })
      }
      this.filterOrder(this.selectTab)
    })
  }
  public qrScanner() {
    this.router.navigateByUrl('/admin/qr-scanner');
  }

}
