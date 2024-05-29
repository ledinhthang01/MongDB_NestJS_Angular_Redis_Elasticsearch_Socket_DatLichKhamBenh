import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MSchedule } from 'src/app/shared/models/schedule';

@Component({
  selector: 'app-register-gallery',
  templateUrl: './register-gallery.component.html',
  styleUrls: ['./register-gallery.component.scss'],
})
export class RegisterGalleryComponent {
  minDate: Date = new Date();
  maxDate: Date = new Date();
  dateStart!: Date;
  dateEnd!: Date;

  constructor(
    public dialogRef: MatDialogRef<RegisterGalleryComponent>,
    @Inject(MAT_DIALOG_DATA) public dataParent: any
  ) {
    this.size = dataParent?.size;
    this.data = dataParent?.data;
    this.title = dataParent?.title;
    this.dialogRef.updateSize(this.size.w, this.size.h);
    if (this.data) {
      this.dateStart = new Date(this.data.dateStart);
      this.dateEnd = new Date(this.data.dateEnd);
      this.type = this.data.type;
    }

    this.minDate.setDate(new Date().getDate() + 2);
    this.maxDate.setDate(new Date().getDate() + 11);
  }
  size: any;
  data: MSchedule;
  title!: string;
  type: string = 'morning';
  isSubmitted = false;
  isNew: boolean = true;
  id: string = '';
  idDoctor: string = '';

  onChangeGender(value: any) {
    this.type = value.target.value;
  }

  get fc() {
    return this.form.controls;
  }

  form = new FormGroup({
    date: new FormControl('', [Validators.required]),
  });

  submit() {
    this.isSubmitted = true;
    if (this.form.invalid) return;
    if (this.data) {
      this.isNew = false;
      this.id = this.data._id;
      this.idDoctor = this.data.idDoctor;
    }
    const data = {
      isNew: this.isNew,
      id: this.id,
      idDoctor: this.idDoctor,
      date: this.form.value.date,
      type: this.type,
    };
    this.dialogRef.close(data);
  }
}
