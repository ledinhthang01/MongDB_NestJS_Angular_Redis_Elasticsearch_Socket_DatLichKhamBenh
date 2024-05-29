import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterPlanRoutingModule } from './register-plan-routing.module';
import { RegisterPlanComponent } from './register-plan/register-plan.component';
import { RegisterGalleryComponent } from './register-gallery/register-gallery.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ScheduleModule } from '@syncfusion/ej2-angular-schedule';
import { ShareModule } from '../../common/share.module';
import { ListPlanComponent } from './list-plan/list-plan.component';
import { GalleryModule } from '../../common/gallery.module';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    RegisterPlanComponent,
    RegisterGalleryComponent,
    ListPlanComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDialogModule,
    BsDatepickerModule.forRoot(),
    RegisterPlanRoutingModule,
    ScheduleModule,
    ShareModule,
    GalleryModule,
    ShareModule,
  ],
})
export class RegisterPlanModule {}
