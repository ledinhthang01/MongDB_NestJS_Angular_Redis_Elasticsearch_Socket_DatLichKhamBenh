import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ToastrService } from 'ngx-toastr';
import { catchError, debounceTime, of } from 'rxjs';
import { MainService } from 'src/app/services/user/main.service';
import { MChat } from 'src/app/shared/models/chat';

@UntilDestroy()
@Component({
  selector: 'app-gallery-search',
  templateUrl: './gallery-search.component.html',
  styleUrls: ['./gallery-search.component.scss'],
})
export class GallerySearchComponent {
  constructor(
    public dialogRef: MatDialogRef<GallerySearchComponent>,
    @Inject(MAT_DIALOG_DATA) public dataParent: any,
    private mainService: MainService,
    private toastr: ToastrService
  ) {
    this.size = dataParent?.size;
    this.dialogRef.updateSize(this.size.w, this.size.h);
  }

  size: any;
  name: string = '';
  searchControl = new FormControl();
  data!: [MChat];

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe((value) => {
        this.findUser(value);
      });
  }

  getFullImagePath(imageName: string): string {
    return `http://localhost:3003/${imageName}`;
  }

  findUser(value: string) {
    this.mainService.chat
      .findUser(value)
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
      });
  }

  close() {
    this.clear();
  }

  clear() {
    this.searchControl.reset('', { emitEvent: false });
  }

  accessChat(id: string) {
    this.dialogRef.close(id);
  }
}
