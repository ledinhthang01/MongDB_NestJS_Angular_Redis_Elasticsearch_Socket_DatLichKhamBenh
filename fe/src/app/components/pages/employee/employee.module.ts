import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeRoutingModule } from './employee-routing.module';
import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { LayoutComponent } from './layout/layout.component';
import { LayoutModule } from '../common/layout.module';

@NgModule({
  declarations: [EmployeeDashboardComponent, LayoutComponent],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    MatSidenavModule,
    LayoutModule,
  ],
})
export class EmployeeModule {}
