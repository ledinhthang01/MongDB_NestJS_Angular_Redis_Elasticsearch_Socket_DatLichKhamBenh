import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetaildoctorComponent } from './detaildoctor/detaildoctor.component';

const routes: Routes = [
    { path: '', component: DetaildoctorComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DetailDoctorRoutingModule { }
