import { Component, OnInit } from '@angular/core';
import { RegisterGalleryComponent } from '../register-gallery/register-gallery.component';
import { MatDialog } from '@angular/material/dialog';
import {
  DayService,
  WeekService,
  WorkWeekService,
  MonthService,
  AgendaService,
  MonthAgendaService,
  TimelineViewsService,
  TimelineMonthService,
  EventSettingsModel,
  View,
} from '@syncfusion/ej2-angular-schedule';
import { MainService } from 'src/app/services/user/main.service';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from 'src/app/services/storage/storage.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { catchError, of } from 'rxjs';
import * as moment from 'moment';
import { MGetAllSchedule, MSchedule } from 'src/app/shared/models/schedule';

@UntilDestroy()
@Component({
  selector: 'app-register-plan',
  templateUrl: './register-plan.component.html',
  providers: [
    DayService,
    WeekService,
    WorkWeekService,
    MonthService,
    AgendaService,
    MonthAgendaService,
    TimelineViewsService,
    TimelineMonthService,
  ],
  styleUrls: ['./register-plan.component.scss'],
})
export class RegisterPlanComponent implements OnInit {
  total!: number;
  page: number = 1;
  schedules!: MGetAllSchedule;
  titles = ['stt', 'date', 'type', ''];
  public dataLoaded: boolean = false;
  public currentView: View = 'Month';
  public selectedDate: Date = new Date();
  public data: object[] = [];
  public eventSettings: EventSettingsModel = {};

  constructor(
    private dialog: MatDialog,
    private mainService: MainService,
    private toastr: ToastrService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.getSchedule();
    this.getWorkingScheduleByDoctor();
  }

  filter(data: any) {
    return data.map((item: any) => {
      const startTime = new Date(item.timeStart);
      const endTime = new Date(item.timeEnd);
      return {
        id: item._id,
        eventName: item.type,
        startTime: startTime,
        endTime: endTime,
        isAllDay: false,
      };
    });
  }

  getWorkingScheduleByDoctor() {
    const currentTime = new Date();
    // currentTime.setDate(currentTime.getDate() - 2);
    currentTime.setDate(currentTime.getDate());
    this.mainService.schedule
      .getWorkingScheduleByDoctor({
        page: '1',
        size: '30',
        subscribed: '',
        idDoctor: this.storageService.cookie.get('id'),
        idCenter: '',
        date: '',
        currentTime: currentTime.toString(),
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
        this.eventSettings.dataSource = this.filter(res.data);
        this.eventSettings.fields = {
          id: 'id',
          subject: { name: 'eventName' },
          isAllDay: { name: 'isAllDay' },
          startTime: { name: 'startTime' },
          endTime: { name: 'endTime' },
        };
        this.dataLoaded = true;
      });
  }

  showGallery(data?: MSchedule, title?: string) {
    const dialogRef = this.dialog.open(RegisterGalleryComponent, {
      data: {
        size: { w: '550px', h: '350px' },
        data: data,
        title: title,
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        if (res.isNew === true) {
          this.resgisterSchedule({ date: res.date, type: res.type });
        } else {
          this.editSchedule(res);
        }
      }
    });
  }

  editSchedule(data: any) {
    this.mainService.schedule
      .editSchedule({
        id: data.id,
        idDoctor: data.idDoctor,
        type: data.type,
        dateStart: moment(data.date[0]).format('YYYY-MM-DD'),
        dateEnd: moment(data.date[1]).format('YYYY-MM-DD'),
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
        this.getSchedule();
      });
  }

  getSchedule() {
    this.mainService.schedule
      .getSchedulesByDoctor({
        page: this.page.toString(),
        size: '10',
        auth: 'false',
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
        this.schedules = res;
        this.total = res.total;
      });
  }
  resgisterSchedule(data: any) {
    this.mainService.schedule
      .registerSchedule({
        id: this.storageService.cookie.get('id'),
        type: data.type,
        dateStart: moment(data.date[0]).format('YYYY-MM-DD'),
        dateEnd: moment(data.date[1]).format('YYYY-MM-DD'),
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
        this.getSchedule();
      });
  }

  onSelected(selectedPage: number) {
    this.page = selectedPage;
    this.getSchedule();
  }

  onScheduleDelete(data: boolean) {
    if (data === true) {
      this.getSchedule();
    }
  }

  onScheduleSelected(data: MSchedule) {
    this.showGallery(data, 'Edit plan');
  }
}
