import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';

import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { FakeDbService } from './fake-db/fake-db.service';
import { JwtInterceptor } from './helper/jwt.interceptor';
import { ErrorInterceptor } from './helper/error.interceptor';
import { HomeComponent } from './main/home/home.component';
import { DialogComponent } from './component/dialog/dialog.component';
import { PhotoDialogComponent } from './component/photo-dialog/photo-dialog.component';

const appRoutes: Routes = [
    {
        path        : 'login',
        loadChildren: () => import('./main/login/login.module').then(m => m.LoginModule)
    },
    {
        path        : 'page',
        loadChildren: () => import('./main/e-commerce/e-commerce.module').then(m => m.EcommerceModule)
    },
    {
        path        : 'sample',
        loadChildren: () => import('./main/sample/sample.module').then(m => m.SampleModule)
    },
    {
        path        : 'forms',
        loadChildren: () => import('./main/forms/forms.module').then(m => m.UIFormsModule)
    },
    {
        path        : 'home',
        component   : HomeComponent
    },
    {
        path        : 'coming-soon',
        loadChildren: () => import('./main/coming-soon/coming-soon.module').then(m => m.ComingSoonModule)
    },
    {
        path        : '**',
        redirectTo  : 'login'
    }
];

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        DialogComponent,
        PhotoDialogComponent,
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes, { useHash: true}),

        TranslateModule.forRoot(),
        InMemoryWebApiModule.forRoot(FakeDbService, {
            delay             : 0,
            passThruUnknownUrl: true
        }),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
    ],
    bootstrap   : [
        AppComponent
    ],
    providers : [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    ]
})
export class AppModule
{
}
