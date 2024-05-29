import { Component, OnInit, ViewChildren } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { MainService } from 'src/app/services/user/main.service';
import { MSchedule, MWorkingSchedule } from 'src/app/shared/models/schedule';
import { ListdoctorComponent } from '../doctor/listdoctor/listdoctor.component';
import { AddressComponent } from '../address/address.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmBookingComponent } from '../confirm-booking/confirm-booking.component';
import { IUserBooking } from 'src/app/shared/interfaces/booking';

@UntilDestroy()
@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
})
export class BookingComponent implements OnInit {
  data!: [MSchedule];
  idBooking!: string;
  page: string = '1';
  size: string = '10';
  @ViewChildren(ListdoctorComponent) getDataDoctor: any;
  @ViewChildren(AddressComponent) getDataCenter: any;

  constructor(
    private mainService: MainService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getBooking();
  }

  getBooking() {
    this.mainService.booking
      .getBooking({ page: this.page, size: this.size })
      .pipe(
        untilDestroyed(this),
        catchError((err) => {
          this.toastr.error(err.error.message, '', {
            timeOut: 2000,
          });
          return of(null);
        })
      )
      .subscribe((res: any) => {
        this.data = res.data;
      });
  }

  onSchedule(data: MWorkingSchedule, index: number) {
    const dialogRef = this.dialog.open(ConfirmBookingComponent, {
      data: {
        size: { w: '750px', h: '750px' },
        data: {
          schedule: data,
          doctor: this.getDataDoctor._results[index].data,
          center: this.getDataCenter._results[index].dataCenter.data,
        },
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.userBooking(res);
      }
    });
  }

  userBooking(data: IUserBooking) {
    this.mainService.booking
      .userBooking({
        idSubscriber: data.idSubscriber,
        idSchedule: data.idSchedule,
      })
      .pipe(
        untilDestroyed(this),
        catchError((err) => {
          this.toastr.error(err.error.message, '', {
            timeOut: 2000,
          });
          return of(null);
        })
      )
      .subscribe((res: any) => {
        this.toastr.success(res.message, '', {
          timeOut: 2000,
        });
      });
  }
}
