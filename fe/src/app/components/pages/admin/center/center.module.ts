import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CenterRoutingModule } from './center-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CRUDCenterComponent } from './crudcenter/crudcenter.component';
import { ListCenterComponent } from './list-center/list-center.component';
import { ShareModule } from '../../common/share.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { GalleryModule } from '../../common/gallery.module';

@NgModule({
  declarations: [
    CRUDCenterComponent,
    ListCenterComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CenterRoutingModule,
    MatDialogModule,
    BsDatepickerModule.forRoot(),
    ShareModule,
    GalleryModule
  ]
})
export class CenterModule { }
