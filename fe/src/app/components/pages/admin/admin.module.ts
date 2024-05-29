import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { LayoutComponent } from './layout/layout.component';
import { LayoutModule } from '../common/layout.module';

@NgModule({
  declarations: [
    DashboardComponent,
    LayoutComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,

    MatSidenavModule,
    LayoutModule
  ]
})
export class AdminModule { }
