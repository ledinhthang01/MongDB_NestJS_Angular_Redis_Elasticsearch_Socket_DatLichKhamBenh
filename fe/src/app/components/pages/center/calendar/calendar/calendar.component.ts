import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MainService } from 'src/app/services/user/main.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { catchError, of } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {
  total!: number;
  page: number = 1;
  schedules!: [];
  titles = ['stt', 'date', 'type', ''];
  dataDoctor!: [];

  constructor(
    private mainService: MainService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getSchedule();
  }

  getSchedule() {
    this.mainService.schedule
      .getSchedulesByAdmin({
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
        this.schedules = res.data;
        this.total = res.total;
      });
  }

  onSelected(selectedPage: number) {
    this.page = selectedPage;
    this.getSchedule();
  }
}
