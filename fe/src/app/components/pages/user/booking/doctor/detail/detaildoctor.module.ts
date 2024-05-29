import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DetailDoctorRoutingModule } from './detaildoctor-routing.module';
import { DetaildoctorComponent } from './detaildoctor/detaildoctor.component';
import { RouterModule } from '@angular/router';
import { CommentComponent } from '../../../common/comment/comment.component';

@NgModule({
    declarations: [DetaildoctorComponent, CommentComponent],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        DetailDoctorRoutingModule
    ]
})
export class DetailDoctorModule { }  
