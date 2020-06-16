import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { UserInfo } from "../../interface/userinfo";

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss']
})
export class ProfileDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: UserInfo,
              public matDialogRef: MatDialogRef<ProfileDialogComponent>) { }

  ngOnInit(): void {
  }
  closeDialog() {
    this.matDialogRef.close();
  }
}
