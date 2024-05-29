import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MEmployee, MGetAllEmployees } from 'src/app/shared/models/employee';
import { MainService } from 'src/app/services/user/main.service';
import { ToastrService } from 'ngx-toastr';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { catchError, of } from 'rxjs';
import { GalleryComponent } from '../../../common/gallery/gallery.component';

@UntilDestroy()
@Component({
  selector: 'app-list-employee',
  templateUrl: './list-employee.component.html',
  styleUrls: ['./list-employee.component.scss'],
})
export class ListEmployeeComponent {
  @Input() data!: MGetAllEmployees;
  @Input() titles!: any;
  @Output() edit = new EventEmitter<MEmployee>();
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
        title: 'Are you sure you want to delete this employee?',
        data: item,
        size: { w: '700px', h: '500px' },
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
      .DeleteEmployee(id)
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
