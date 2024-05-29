import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninupComponent } from './Signinup/signinup.component';

const routes: Routes = [
    {
        path: '', component: SigninupComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
