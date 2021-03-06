import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoginComponent } from './container/login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ShareModule } from './share/share.module';
import { MaterialModule } from './material/material.module';
import { ToolBarComponent } from './component/tool-bar/tool-bar.component';
import { SideBarComponent } from './component/side-bar/side-bar.component';
import { NavigationBarComponent } from './component/navigation-bar/navigation-bar.component';
import { DialogComponent } from './component/dialog/dialog.component';
import { ErrorInterceptor } from './helper/error.interceptor';
import { JwtInterceptor } from './helper/jwt.interceptor';
import { HomeComponent } from './container/home/home.component';
import { BillboardComponent } from './container/billboard/billboard.component';
import { AuthGuard } from './helper/auth.guard';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { LogoComponent } from './component/logo/logo.component';
import { CartComponent } from './component/cart/cart.component';
import { QrcodeDialogComponent } from './component/qrcode-dialog/qrcode-dialog.component';
import { QRCodeModule } from 'angularx-qrcode';

const appRoutes: Routes = [
  {
    path        : 'login',
    component   : LoginComponent
  },
  {
    path        : 'home',
    component   : HomeComponent
  },
  {
    path        : 'billboard',
    component   : BillboardComponent,
    canActivate : [AuthGuard]
  },
  {
    path        : 'afternoon-tea',
    loadChildren: () => import('./container/afternoon-tea/afternoon-tea.module').then(m => m.AfternoonTeaModule)
  },
  {
    path        : 'error-page',
    loadChildren: () => import('./container/error-page/error-page.module').then(m => m.ErrorPageModule)
  },
  {
    path        : 'admin',
    loadChildren: () => import('./container/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path        : '**',
    redirectTo  : 'login'
  }
];



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ToolBarComponent,
    SideBarComponent,
    NavigationBarComponent,
    DialogComponent,
    HomeComponent,
    BillboardComponent,
    LogoComponent,
    CartComponent,
    QrcodeDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FontAwesomeModule,

    RouterModule.forRoot(appRoutes, {useHash: true}),

    ShareModule,
    MaterialModule,
    AngularSvgIconModule,
    QRCodeModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
  ],
  bootstrap: [AppComponent],

  exports: [
  ]
})
export class AppModule { }
