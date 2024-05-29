import { Component } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { StorageService } from 'src/app/services/storage/storage.service';
import { MainService } from 'src/app/services/user/main.service';
import { MScheduleByDoctor } from 'src/app/shared/models/booking';

@UntilDestroy()
@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent {
  data!: MScheduleByDoctor

  constructor(
    private mainService: MainService,
    private toastr: ToastrService,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.getScheduleByDoctor()
  }

  getScheduleByDoctor(){
    this.mainService.booking.getScheduleByDoctor({ page: '1', size: '10', idDoctor: this.storageService.cookie.get('id'), done: "false" }).pipe(
      untilDestroyed(this),
      catchError(err => {
        this.toastr.error(err.error.message, "", {
          timeOut: 2000,
        })
        return of(null)
      })
    ).subscribe((res: any) => {
      this.data = res
    })
  }

  done(id: string){
    this.mainService.booking.doneSchedule(id).pipe(
      untilDestroyed(this),
      catchError(err => {
        this.toastr.error(err.error.message, "", {
          timeOut: 2000,
        })
        return of(null)
      })
    ).subscribe((res: any) => {
      this.toastr.success(res.message, "", {
        timeOut: 2000,
      })
      this.data.data = this.data.data.filter(item => item._id !== res.data);
    })
  }
}
