import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { StorageService } from 'src/app/services/storage/storage.service';
import { MainService } from 'src/app/services/user/main.service';
import { MUser } from 'src/app/shared/models/user';

@UntilDestroy()
@Component({
  selector: 'app-confirm-booking',
  templateUrl: './confirm-booking.component.html',
  styleUrls: ['./confirm-booking.component.scss']
})
export class ConfirmBookingComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmBookingComponent>,
    @Inject(MAT_DIALOG_DATA) public dataParent: any,
    private storageService: StorageService,
    private toastr: ToastrService,
    private mainService: MainService,
  ) {
    this.data = dataParent?.data;

    this.size = dataParent?.size;
    this.dialogRef.updateSize(this.size.w, this.size.h)
    this.date = moment(this.data.schedule.date).format('YYYY-MM-DD')
  }
  size: any;
  data: any
  date: any
  user!: MUser

  ngOnInit(): void {
    this.getInfor()
  }

  getInfor() {
    const id = this.storageService.cookie.get('id');
    if (!id) {
      return;
    }
    this.mainService.auth.getInfo(id).pipe(
      untilDestroyed(this),
      catchError(err => {
        this.toastr.error(err.error.message, "", {
          timeOut: 2000,
        })
        return of(null)
      })
    ).subscribe((res: any) => {
      this.user = res
    })
  }

  booking() {
    const idSubscriber = this.storageService.cookie.get('id');
    if (!idSubscriber) {
      this.toastr.error('Sign in, please!', "", {
        timeOut: 2000,
      })
      return
    }
    const data = {
      idSubscriber,
      idSchedule: this.data.schedule._id
    }
    this.dialogRef.close(data)
  }
}
