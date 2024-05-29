import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExaminedComponent } from './examined/examined.component';

const routes: Routes = [
  { path: '', component: ExaminedComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExaminedRoutingModule { }
