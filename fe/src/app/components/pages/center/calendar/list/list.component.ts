import { Component, Input } from '@angular/core';
import { MSchedule } from 'src/app/shared/models/schedule';
import { GalleryConfirmsComponent } from '../../../common/gallery-confirms/gallery-confirms.component';
import { MatDialog } from '@angular/material/dialog';
import { MainService } from 'src/app/services/user/main.service';
import { ToastrService } from 'ngx-toastr';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { catchError, of } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent {
  @Input() data: any;
  @Input() titles: any;
  swap: boolean = false;

  constructor(
    private dialog: MatDialog,
    private mainService: MainService,
    private toastr: ToastrService
  ) {}

  showGallery(item: MSchedule) {
    const dialogRef = this.dialog.open(GalleryConfirmsComponent, {
      data: {
        size: { w: '550px', h: '420px' },
        data: item,
        isDelete: false,
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.confirm(res);
      }
    });
  }

  confirm(data: any) {
    this.mainService.schedule
      .authSchedule(data)
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
        this.toastr.success(res.message, '', {
          timeOut: 2000,
        });
        this.data = this.removeObjectById(this.data, res.data._id);
      });
  }

  removeObjectById(objects: any[], idToRemove: number): any[] {
    return objects.filter((obj) => obj._id !== idToRemove);
  }

  sort(swap: boolean, sortBy: 'dateStart' | 'dateEnd') {
    if (swap === false) {
      this.data.sort((a: any, b: any) => {
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
      this.data.sort((a: any, b: any) => {
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
