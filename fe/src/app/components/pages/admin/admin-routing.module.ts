import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'create-employee', loadChildren: () => import('./employee/crud-employee.module').then(m => m.CRUDEmployeeModule), pathMatch: 'full' },
      { path: 'create-center', loadChildren: () => import('./center/center.module').then(m => m.CenterModule), pathMatch: 'full' },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
