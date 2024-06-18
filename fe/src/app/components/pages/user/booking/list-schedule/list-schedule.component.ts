import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { SocketService } from 'src/app/services/socket/socket.service';
import { MainService } from 'src/app/services/user/main.service';
import { IScheduleBooking } from 'src/app/shared/interfaces/booking';
import { MDatesAuthed } from 'src/app/shared/models/booking';
import {
  MBookingSchedule,
  MWorkingSchedule,
} from 'src/app/shared/models/schedule';

@UntilDestroy()
@Component({
  selector: 'app-list-schedule',
  templateUrl: './list-schedule.component.html',
  styleUrls: ['./list-schedule.component.scss'],
})
export class ListScheduleComponent implements OnChanges {
  @Input() id!: string;
  @Input() idDoctor!: string;
  @Output() schedule: EventEmitter<MWorkingSchedule> =
    new EventEmitter<MWorkingSchedule>();
  data!: MBookingSchedule;
  date!: MDatesAuthed;

  constructor(
    private mainService: MainService,
    private toastr: ToastrService,
    private socket: SocketService
  ) {}

  ngOnInit(): void {
    this.getDatesAuthed(this.idDoctor);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.socket.getMessage('BookingSuccessfully').subscribe((res: any) => {
      const filteredData = this.data.data.filter((item) => item._id !== res);
      this.data.data = filteredData;
      console.log(res);
    });
  }

  getDatesAuthed(id: string) {
    this.mainService.booking
      .getDatesAuthed(id)
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
        this.date = res;
        this.getScheduleBooking(res.data[0]);
      });
  }

  onDateSelected(value: any) {
    const selectElement = value.target as HTMLSelectElement;
    const selectedValue = JSON.parse(selectElement.value);
    this.getScheduleBooking({
      idParent: selectedValue.idParent,
      idDoctor: selectedValue.idDoctor,
      date: selectedValue.date,
    });
  }

  getScheduleBooking(data: IScheduleBooking) {
    this.mainService.booking
      .getScheduleBooking({
        idParent: data.idParent,
        idDoctor: data.idDoctor,
        date: data.date,
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
        this.data = res;
      });
  }
}
