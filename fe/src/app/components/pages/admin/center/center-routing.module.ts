import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CRUDCenterComponent } from './crudcenter/crudcenter.component';

const routes: Routes = [
    { path: '', component: CRUDCenterComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CenterRoutingModule { }
