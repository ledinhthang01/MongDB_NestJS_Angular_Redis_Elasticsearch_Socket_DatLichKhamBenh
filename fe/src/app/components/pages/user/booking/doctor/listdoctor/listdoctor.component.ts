import { Component, HostListener, Input } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { MainService } from 'src/app/services/user/main.service';
import { MDoctorByUser } from 'src/app/shared/models/doctor';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@UntilDestroy()
@Component({
  selector: 'app-listdoctor',
  templateUrl: './listdoctor.component.html',
  styleUrls: ['./listdoctor.component.scss'],
})
export class ListdoctorComponent {
  screenWidth!: number;
  @Input() id!: string;
  data!: MDoctorByUser;
  safeHtmlDescription!: SafeHtml;

  constructor(private mainService: MainService, private toastr: ToastrService) {
    this.screenWidth = window.innerWidth;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
  }

  ngOnInit(): void {
    this.getInfoDoctor();
  }

  getInfoDoctor() {
    this.mainService.doctor
      .getDetailInforDoctorByUser(this.id)
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
        this.safeHtmlDescription = this.data?.describe;
      });
  }
}
