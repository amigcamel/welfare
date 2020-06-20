import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { ShareModule } from "../../share/share.module";
import { MaterialModule } from "../../material/material.module";
import { RouterModule, Routes } from "@angular/router";
import { AppModule } from "../../app.module";


const routes: Routes = [
  {
    path     : '',
    component: AdminComponent
  }
];

@NgModule({
  declarations: [
    AdminComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ShareModule,
    MaterialModule,
  ]
})
export class AdminModule { }
