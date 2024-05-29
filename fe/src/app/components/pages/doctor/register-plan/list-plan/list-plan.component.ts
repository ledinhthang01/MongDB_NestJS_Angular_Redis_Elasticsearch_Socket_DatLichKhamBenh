import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { MainService } from 'src/app/services/user/main.service';
import { MGetAllSchedule, MSchedule } from 'src/app/shared/models/schedule';
import { MatDialog } from '@angular/material/dialog';
import { GalleryConfirmsComponent } from '../../../common/gallery-confirms/gallery-confirms.component';

@UntilDestroy()
@Component({
  selector: 'app-list-plan',
  templateUrl: './list-plan.component.html',
  styleUrls: ['./list-plan.component.scss'],
})
export class ListPlanComponent {
  @Input() data!: MGetAllSchedule;
  @Input() titles!: any;
  @Output() edit = new EventEmitter<MSchedule>();
  @Output() delete: EventEmitter<boolean> = new EventEmitter<boolean>();
  swap: boolean = false;

  constructor(
    private dialog: MatDialog,
    private mainService: MainService,
    private toastr: ToastrService
  ) {}

  showGallery(item: MSchedule) {
    const dialogRef = this.dialog.open(GalleryConfirmsComponent, {
      data: {
        size: { w: '500px', h: '320px' },
        data: item,
        isDelete: true,
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.confirmDelete(res);
      }
    });
  }

  confirmDelete(data: any) {
    this.mainService.schedule
      .deleteSchedule(data)
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
          this.toastr.success(res, '', {
            timeOut: 2000,
          });
        }
      });
  }

  sort(swap: boolean, sortBy: 'dateStart' | 'dateEnd') {
    if (swap === false) {
      this.data.data.sort((a, b) => {
        return sortBy === 'dateStart'
          ? a.dateStart < b.dateStart
            ? -1
            : a.dateStart > b.dateStart
            ? 1
            : 0
          : sortBy === 'dateEnd'
          ? a.dateEnd < b.dateEnd
            ? -1
            : a.dateEnd > b.dateEnd
            ? 1
            : 0
          : 0;
      });
    } else {
      this.data.data.sort((a, b) => {
        return sortBy === 'dateStart'
          ? a.dateStart > b.dateStart
            ? -1
            : a.dateStart < b.dateStart
            ? 1
            : 0
          : sortBy === 'dateEnd'
          ? a.dateEnd > b.dateEnd
            ? -1
            : a.dateEnd < b.dateEnd
            ? 1
            : 0
          : 0;
      });
    }
    this.swap = swap;
  }
}
