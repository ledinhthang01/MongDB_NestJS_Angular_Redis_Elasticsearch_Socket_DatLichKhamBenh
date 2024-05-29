import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingComponent } from './booking/booking.component';

const routes: Routes = [
    { path: '', component: BookingComponent },
    { path: 'detaildoctor/:id', loadChildren: () => import('./doctor/detail/detaildoctor.module').then(m => m.DetailDoctorModule) },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BookingRoutingModule { }
