import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CenterRoutingModule } from './center-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { LayoutComponent } from './layout/layout.component';
import { LayoutModule } from '../common/layout.module';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    DashboardComponent,
    LayoutComponent
  ],
  imports: [
    CommonModule,
    CenterRoutingModule,

    MatSidenavModule,
    LayoutModule,
  ]
})
export class CenterModule { }
