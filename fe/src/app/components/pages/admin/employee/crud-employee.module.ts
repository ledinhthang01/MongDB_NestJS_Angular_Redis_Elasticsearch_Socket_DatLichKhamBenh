import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CRUDEmployeeRoutingModule } from './crud-employee-routing.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { ListEmployeeComponent } from './list-employee/list-employee.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ShareModule } from '../../common/share.module';
import { GalleryModule } from '../../common/gallery.module';

@NgModule({
  declarations: [AddEmployeeComponent, ListEmployeeComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CRUDEmployeeRoutingModule,

    BsDatepickerModule.forRoot(),
    MatDialogModule,
    ShareModule,
    GalleryModule,
  ],
})
export class CRUDEmployeeModule {}
