import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DoctorRoutingModule } from './doctor-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout.component';
import { LayoutModule } from '../common/layout.module';
import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
  declarations: [
    DashboardComponent,
    LayoutComponent
  ],
  imports: [
    CommonModule,
    DoctorRoutingModule,
    LayoutModule,
    MatSidenavModule,
  ]
})
export class DoctorModule { }
