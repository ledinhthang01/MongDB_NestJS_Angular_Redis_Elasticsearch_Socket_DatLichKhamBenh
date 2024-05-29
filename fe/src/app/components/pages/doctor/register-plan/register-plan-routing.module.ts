import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterPlanComponent } from './register-plan/register-plan.component';

const routes: Routes = [
  {
    path: '', component: RegisterPlanComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterPlanRoutingModule { }
