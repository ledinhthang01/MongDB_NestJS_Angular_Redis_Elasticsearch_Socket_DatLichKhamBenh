import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { StorageService } from 'src/app/services/storage/storage.service';
import { MainService } from 'src/app/services/user/main.service';

@UntilDestroy()
@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent {
  constructor(
    private mainService: MainService,
    private toastr: ToastrService,
    private storageService: StorageService,
    public dialogRef: MatDialogRef<GalleryComponent>,
    @Inject(MAT_DIALOG_DATA) public dataParent: any
  ) {
    this.size = dataParent?.size;
    this.dialogRef.updateSize(this.size.w, this.size.h);
  }

  size: any;

  deletePost(id: string) {
    this.mainService.post
      .deletePost(id)
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
        this.storageService.local.delete('idPost');
      });
  }

  confirm() {
    this.deletePost(this.storageService.local.get('idPost') as string);
    this.storageService.local.delete('idPost');
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
