import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarComponent } from './calendar/calendar.component';
import { ListComponent } from './list/list.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { ShareModule } from '../../common/share.module';


@NgModule({
  declarations: [
    CalendarComponent,
    ListComponent,
  ],
  imports: [
    CommonModule,
    CalendarRoutingModule,
    MatIconModule,
    MatDialogModule,
    ShareModule
  ]
})
export class CalendarModule { }
