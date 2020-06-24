import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogConfig } from "../../interface/dialog";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogConfig,
              public matDialogRef: MatDialogRef<DialogComponent>) { }

  ngOnInit(): void {

  }
  onPositive(): void {
    this.matDialogRef.close(true);
  }
  onNegative(): void {
    this.matDialogRef.close(false)
  }

}
