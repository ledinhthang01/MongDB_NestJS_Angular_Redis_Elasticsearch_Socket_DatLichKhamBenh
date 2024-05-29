import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneralComponent } from './general/general.component';
import { BookingComponent } from './booking/booking.component';

const routes: Routes = [
  {
    path: '',
    component: GeneralComponent,
    children: [
      { path: '', component: BookingComponent },
      {
        path: 'examined',
        loadChildren: () =>
          import('./examined/examined.module').then((m) => m.ExaminedModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookingRoutingModule {}
