import { Component } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { StorageService } from 'src/app/services/storage/storage.service';
import { MainService } from 'src/app/services/user/main.service';
import { MScheduleByUser } from 'src/app/shared/models/booking';

@UntilDestroy()
@Component({
  selector: 'app-examined',
  templateUrl: './examined.component.html',
  styleUrls: ['./examined.component.scss']
})
export class ExaminedComponent {
  data!: MScheduleByUser

  constructor(
    private mainService: MainService,
    private toastr: ToastrService,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.getScheduleByUser()
  }

  getScheduleByUser(){
    this.mainService.booking.getScheduleByUser({ page: '1', size: '10', idUser: this.storageService.cookie.get('id'), done: "true" }).pipe(
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
