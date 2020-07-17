import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogConfig } from '../../interface/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  public totalValue = 0;
  public totalPrice = 0;
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogConfig,
              public matDialogRef: MatDialogRef<DialogComponent>) { }

  ngOnInit(): void {
    this.handlePreviewCart();
  }
  onPositive(): void {
    this.matDialogRef.close(true);
  }
  onNegative(): void {
    this.matDialogRef.close(false);
  }
  handlePreviewCart(): void {
    if (this.data.contentType === 'cart') {
      for (const item of this.data.items) {
        this.totalValue += item.count;
        this.totalPrice += item.total;
      }
    }
  }
}
