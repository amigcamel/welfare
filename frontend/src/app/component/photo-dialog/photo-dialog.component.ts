import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-photo-dialog',
  templateUrl: './photo-dialog.component.html',
  styleUrls: ['./photo-dialog.component.scss']
})
export class PhotoDialogComponent implements OnInit {

  constructor(
      @Inject(MAT_DIALOG_DATA) private data,
      public matDialogRef: MatDialogRef<PhotoDialogComponent>,
  ) { }

  ngOnInit(): void {
  }
    closeDialog(): void {
      this.matDialogRef.close();
    }

}
