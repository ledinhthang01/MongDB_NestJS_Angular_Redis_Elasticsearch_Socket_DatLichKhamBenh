import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntroduceComponent } from './introduce/introduce.component';

const routes: Routes = [
    {
        path: '', component: IntroduceComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HospitalRoutingModule { }
