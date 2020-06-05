import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NoAuthComponent } from './no-auth/no-auth.component';
import { NotFoundComponent } from './not-found/not-found.component';
const routes = [
    {
        path     : 'not-found',
        component: NotFoundComponent,
    },
    {
        path     : 'no-auth',
        component: NoAuthComponent
    }
];

@NgModule({
    declarations: [
        NoAuthComponent,
        NotFoundComponent
    ],
    imports     : [
        RouterModule.forChild(routes),
    ]
})
export class ErrorPageModule {}
