import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { ShareModule } from '../../share/share.module';
import { MaterialModule } from '../../material/material.module';
import { RouterModule, Routes } from '@angular/router';
import { QrcodeScannerComponent } from './qrcode-scanner/qrcode-scanner.component';
import { AdminGuard } from '../../helper/admin.guard';


const routes: Routes = [
  {
    path     : 'main',
    component: AdminComponent,
    canActivate: [AdminGuard]
  },
  {
    path     : 'qr-scanner',
    component: QrcodeScannerComponent,
    canActivate: [AdminGuard]
  }
];

@NgModule({
  declarations: [
    AdminComponent,
    QrcodeScannerComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ShareModule,
    MaterialModule,
  ]
})
export class AdminModule { }
