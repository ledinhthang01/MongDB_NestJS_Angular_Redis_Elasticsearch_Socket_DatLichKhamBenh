import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingRoutingModule } from './booking-routing.module';
import { BookingComponent } from './booking/booking.component';
import { GeneralComponent } from './general/general.component';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    BookingComponent,
    GeneralComponent
  ],
  imports: [
    CommonModule,
    BookingRoutingModule,
    MatIconModule,
  ]
})
export class BookingModule { }
