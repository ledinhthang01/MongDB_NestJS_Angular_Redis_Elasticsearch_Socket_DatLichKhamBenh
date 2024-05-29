import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent {
  bsConfig: Partial<BsDatepickerConfig>;
  isSubmittSignUp = false;
  type: string = "male";

  constructor(
    public dialogRef: MatDialogRef<GalleryComponent>,
  ) {
    this.dialogRef.updateSize('600px', '600px');
    this.bsConfig = {
      dateInputFormat: 'DD/MM/YYYY'
    };
  }

  formSignUp = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required, Validators.minLength(10)]),
    dateOfBirth: new FormControl('', [Validators.required])
  })

  get fcSignUp() {
    return this.formSignUp.controls;
  }


  signUp() {
    this.isSubmittSignUp = true;
    if (this.formSignUp.invalid) return;
    this.dialogRef.close([this.formSignUp.value, this.type])
    this.formSignUp.reset();
  }

  onChange(value: any) {
    this.type = value.target.value;
  }
}
