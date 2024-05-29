import { Component, Input } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { MainService } from 'src/app/services/user/main.service';
import { MInfoCenterByUser } from 'src/app/shared/models/center';

@UntilDestroy()
@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent {
  @Input() idCenter!: string;
  dataCenter!: MInfoCenterByUser

  constructor(
    private mainService: MainService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getInfoCenter(this.idCenter)
  }

  getInfoCenter(id: string) {
    this.mainService.booking.getInfoCenterByUser(id).pipe(
      untilDestroyed(this),
      catchError(err => {
        this.toastr.error(err.error.message, "", {
          timeOut: 2000,
        })
        return of(null)
      })
    ).subscribe((res: any) => {
      this.dataCenter = res
    })
  }
}
