import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';

import { FuseSharedModule } from '@fuse/shared.module';
import { FormsComponent } from './forms.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioButton, MatRadioModule } from '@angular/material/radio';
import { HistoryComponent } from '../history/history.component';

const routes: Routes = [
    {
        path     : 'forms',
        component: FormsComponent
    },
    {
        path     : 'history',
        component: HistoryComponent
    }
];

@NgModule({
    declarations: [

        FormsComponent,
        HistoryComponent,
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatStepperModule,
        MatDialogModule,
        MatCheckboxModule,
        MatExpansionModule,
        MatRadioModule,

        FuseSharedModule,
    ]
})
export class UIFormsModule
{
}
