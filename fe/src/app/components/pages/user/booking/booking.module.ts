import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BookingRoutingModule } from './booking-routing.module';
import { ListdoctorComponent } from './doctor/listdoctor/listdoctor.component';
import { RouterModule } from '@angular/router';
import { BookingComponent } from './booking/booking.component';
import { ListScheduleComponent } from './list-schedule/list-schedule.component';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmBookingComponent } from './confirm-booking/confirm-booking.component';
import { AddressComponent } from './address/address.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
    declarations: [
        ListdoctorComponent,
        BookingComponent,
        ListScheduleComponent,
        ConfirmBookingComponent,
        AddressComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        MatIconModule,
        MatDialogModule,
        ReactiveFormsModule,
        BookingRoutingModule,
    ]
})
export class BookingModule { }  
