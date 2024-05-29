import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DoctorRoutingModule } from './doctor-routing.module';
import { DoctorComponent } from './doctor/doctor.component';
import { ShareModule } from '../../common/share.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ListDoctorComponent } from './list-doctor/list-doctor.component';
import { NgxEditorModule } from 'ngx-editor';
import { MatDialogModule } from '@angular/material/dialog';
import { GalleryModule } from '../../common/gallery.module';

@NgModule({
  declarations: [
    DoctorComponent,
    ListDoctorComponent,
  ],
  imports: [
    CommonModule,
    DoctorRoutingModule,
    FormsModule,
    MatDialogModule,
    ReactiveFormsModule,
    ShareModule,
    BsDatepickerModule.forRoot(),
    NgxEditorModule,
    GalleryModule
  ]
})
export class DoctorModule { }
