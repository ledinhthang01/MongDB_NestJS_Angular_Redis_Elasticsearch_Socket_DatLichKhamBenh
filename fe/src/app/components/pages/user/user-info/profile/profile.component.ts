import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { StorageService } from 'src/app/services/storage/storage.service';
import { MainService } from 'src/app/services/user/main.service';
import { MUser } from 'src/app/shared/models/user';

@UntilDestroy()
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  data!: MUser
  date!: string

  constructor(
    private storageService: StorageService,
    private router: Router,
    private mainService: MainService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void { 
    this.getMyInfo()
  }

  getMyInfo(){
    this.mainService.auth.getInfo(this.storageService.cookie.get('id')).pipe(
      untilDestroyed(this),
      catchError(err => {
        this.toastr.error(err.error.message, "", {
          timeOut: 2000,
        })
        return of(null)
      })
    ).subscribe((res: any) => {
      this.data = res
      this.date = moment(this.data.dateOfBirth).format('YYYY-MM-DD')
    })
  }

  logout() {
    this.mainService.auth.logOut(this.storageService.cookie.get('id')).pipe(
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
      this.storageService.cookie.removeAll();
      this.storageService.local.removeAll();
      this.router.navigate(['']);
    })
  }
}
