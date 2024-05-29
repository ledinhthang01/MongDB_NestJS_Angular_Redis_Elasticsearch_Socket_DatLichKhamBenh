import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeCreatePostComponent } from './employee-create-post/employee-create-post.component';
import { CanDeactivateGuard } from 'src/app/components/guards/can-deactivate-guard.guard';

const routes: Routes = [
  {
    path: '',
    component: EmployeeCreatePostComponent,
    canDeactivate: [CanDeactivateGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeCreatePostRouting {}
