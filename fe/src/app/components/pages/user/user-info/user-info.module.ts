import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserInfoRoutingModule } from './user-info-routing.module';
import { GeneralInfoComponent } from './general-info/general-info.component';
import { ProfileComponent } from './profile/profile.component';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [ GeneralInfoComponent, ProfileComponent],
  imports: [
    CommonModule,
    UserInfoRoutingModule,
    MatIconModule,
  ]
})
export class UserInfoModule { }
