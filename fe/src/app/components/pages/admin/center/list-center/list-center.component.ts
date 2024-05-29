import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ToastrService } from 'ngx-toastr';
import { MainService } from 'src/app/services/user/main.service';
import { MCenter, MGetAllCenters } from 'src/app/shared/models/center';
import { catchError, of } from 'rxjs';
import { GalleryComponent } from '../../../common/gallery/gallery.component';

@Component({
  selector: 'app-list-center',
  templateUrl: './list-center.component.html',
  styleUrls: ['./list-center.component.scss'],
})
@UntilDestroy()
export class ListCenterComponent {
  @Input() data!: MGetAllCenters;
  @Input() titles!: any;
  @Output() edit = new EventEmitter<MCenter>();
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
        title: 'Are you sure you want to delete this center?',
        data: item,
        size: { w: '650px', h: '500px' },
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.confirmDelete(res._id);
      }
    });
  }

  confirmDelete(id: string) {
    this.mainService.admin
      .deleteCenter(id)
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
