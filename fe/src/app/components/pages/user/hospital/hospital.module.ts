import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HospitalRoutingModule } from './hospital-routing.module';
import { IntroduceComponent } from './introduce/introduce.component';

@NgModule({
    declarations: [IntroduceComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HospitalRoutingModule
    ]
})
export class BookingModule { }  
