import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './container/login/login.component';
import { RouterModule, Routes } from "@angular/router";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import {ShareModule} from "./share/share.module";
import {MaterialModule} from "./material/material.module";
import { ToolBarComponent } from './component/tool-bar/tool-bar.component';
import { SideBarComponent } from './component/side-bar/side-bar.component';
import { NavigationBarComponent } from './component/navigation-bar/navigation-bar.component';
import { WelfareIconDirective } from './directive/welfare-icon.directive';
import { CartDialogComponent } from "./component/cart-dialog/cart-dialog.component";
import { PhotoDialogComponent } from "./component/photo-dialog/photo-dialog.component";
import { DialogComponent } from "./component/dialog/dialog.component";
import { ErrorInterceptor } from "./helper/error.interceptor";
import { JwtInterceptor } from "./helper/jwt.interceptor";
import { HomeComponent } from "./container/home/home.component";
import { BillboardComponent } from './container/billboard/billboard.component';
import { AuthGuard } from "./helper/auth.guard";
import { ProfileDialogComponent } from './component/profile-dialog/profile-dialog.component';

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
    WelfareIconDirective,
    CartDialogComponent,
    PhotoDialogComponent,
    DialogComponent,
    HomeComponent,
    BillboardComponent,
    ProfileDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,

    RouterModule.forRoot(appRoutes, { useHash: true }),

    ShareModule,
    MaterialModule
  ],
  providers : [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],

})
export class AppModule { }
