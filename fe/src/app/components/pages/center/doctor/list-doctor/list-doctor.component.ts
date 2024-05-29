import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MDoctor, MGetAllDoctors } from 'src/app/shared/models/doctor';
import { MatDialog } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { MainService } from 'src/app/services/user/main.service';
import { GalleryComponent } from '../../../common/gallery/gallery.component';

@UntilDestroy()
@Component({
  selector: 'app-list-doctor',
  templateUrl: './list-doctor.component.html',
  styleUrls: ['./list-doctor.component.scss'],
})
export class ListDoctorComponent {
  @Input() data!: MGetAllDoctors;
  @Input() titles!: any;
  @Output() edit = new EventEmitter<MDoctor>();
  @Output() delete: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private dialog: MatDialog,
    private mainService: MainService,
    private toastr: ToastrService
  ) {
    this.delete.emit(false);
  }

  showGallery(item: any) {
    const dialogRef = this.dialog.open(GalleryComponent, {
      data: {
        data: item,
        size: { w: '650px', h: '600px' },
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.confirmDelete(res._id);
      }
    });
  }

  confirmDelete(id: string) {
    this.mainService.doctor
      .deleteDoctor(id)
      .pipe(
        untilDestroyed(this),
        catchError((err) => {
          this.toastr.error(err.error.message, '', {
            timeOut: 2000,
          });
          return of(null);
        })
      )
      .subscribe((res) => {
        if (res) {
          this.delete.emit(true);
          this.toastr.success(res.message, '', {
            timeOut: 2000,
          });
        }
      });
  }
}
