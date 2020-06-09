import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryComponent } from "./history/history.component";
import { RouterModule, Routes } from "@angular/router";
import { FormService } from "../../service/form.service";
import { AuthGuard } from "../../helper/auth.guard";
import { HistoryService } from "../../service/history.service";
import { FormComponent } from "./form/form.component";
import { MaterialModule } from "../../material/material.module";
import { ShareModule } from "../../share/share.module";
import { MatIconModule } from "@angular/material/icon";
import { ComingSoonComponent } from "./coming-soon/coming-soon.component";

const routes: Routes = [
  {
    path     : 'form',
    component: FormComponent,
    resolve: {
      formData: FormService
    },
    canActivate: [AuthGuard]
  },
  {
    path     : 'history',
    component: HistoryComponent,
    resolve: {
      historyData: HistoryService
    },
    canActivate: [AuthGuard]
  },
  {
    path     : 'coming-soon',
    component: ComingSoonComponent
  }
];

@NgModule({
  declarations: [
    HistoryComponent,
    FormComponent,
    ComingSoonComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    ShareModule,
  ]
})
export class AfternoonTeaModule { }
