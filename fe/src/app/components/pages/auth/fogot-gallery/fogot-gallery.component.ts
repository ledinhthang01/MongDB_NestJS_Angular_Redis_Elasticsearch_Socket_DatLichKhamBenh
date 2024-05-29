import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-fogot-gallery',
  templateUrl: './fogot-gallery.component.html',
  styleUrls: ['./fogot-gallery.component.scss']
})
export class FogotGalleryComponent {
  isSubmitted = false;
  constructor(
    public dialogRef: MatDialogRef<FogotGalleryComponent>,
  ) {
    this.dialogRef.updateSize('500px', '280px')
  }

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  })

  get fcForgot() {
    return this.form.controls;
  }

  Submit() {
    this.isSubmitted = true;
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.value)
    this.form.reset();
  }
}
