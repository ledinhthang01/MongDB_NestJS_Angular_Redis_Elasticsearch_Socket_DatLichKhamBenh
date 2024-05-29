import { Component } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { StorageService } from 'src/app/services/storage/storage.service';
import { MainService } from 'src/app/services/user/main.service';
import { MScheduleByDoctor } from 'src/app/shared/models/booking';

@UntilDestroy()
@Component({
  selector: 'app-examined',
  templateUrl: './examined.component.html',
  styleUrls: ['./examined.component.scss']
})
export class ExaminedComponent {
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
    this.mainService.booking.getScheduleByDoctor({ page: '1', size: '10', idDoctor: this.storageService.cookie.get('id'), done: "true" }).pipe(
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

}
