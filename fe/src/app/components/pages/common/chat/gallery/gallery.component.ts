import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ToastrService } from 'ngx-toastr';
import { catchError, debounceTime, of } from 'rxjs';
import { MainService } from 'src/app/services/user/main.service';
import { MChat } from 'src/app/shared/models/chat';

@UntilDestroy()
@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent {
  constructor(
    public dialogRef: MatDialogRef<GalleryComponent>,
    @Inject(MAT_DIALOG_DATA) public dataParent: any,
    private mainService: MainService,
    private toastr: ToastrService
  ) {
    this.size = dataParent?.size;
    this.dialogRef.updateSize(this.size.w, this.size.h);
  }

  size: any;
  name: string = '';
  member: MChat[] = [];
  isSubmitted = false;
  searchControl = new FormControl();
  data: MChat[] = [];

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
        if (this.data.length != 0) {
          this.dialogRef.updateSize('600px', '580px');
        }
      });
  }

  addMember(item: MChat) {
    this.member.push(item);
    this.data = this.data.filter((i) => i._id !== item._id);
    if (this.data.length == 0) {
      this.dialogRef.updateSize('600px', '500px');
    }
  }

  removeMember(item: MChat) {
    this.data.push(item);
    this.member = this.member.filter((i) => i._id !== item._id);
  }

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });

  get fc() {
    return this.form.controls;
  }

  confirm() {
    this.isSubmitted = true;
    if (this.form.invalid) return;
    if (this.member.length == 0) {
      this.toastr.error('Please choose member for group chat!', '', {
        timeOut: 2000,
      });
      return;
    }

    if (this.member.length < 2) {
      this.toastr.error(
        'Please choose the number of members greater than 2!',
        '',
        {
          timeOut: 2000,
        }
      );
      return;
    }
    this.dialogRef.close({ name: this.form.value.name, users: this.member });
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
