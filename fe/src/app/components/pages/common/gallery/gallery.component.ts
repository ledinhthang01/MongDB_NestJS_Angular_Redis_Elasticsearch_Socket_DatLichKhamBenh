import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent {
  constructor(
    public dialogRef: MatDialogRef<GalleryComponent>,
    @Inject(MAT_DIALOG_DATA) public dataParent: any
  ) {
    this.data = dataParent?.data;
    this.size = dataParent?.size;
    this.title = dataParent?.title;
    this.dialogRef.updateSize(this.size.w, this.size.h);
  }

  title!: string;
  data: any;
  size: any;

  onConfirm() {
    this.dialogRef.close(this.data);
  }
  cancel() {
    this.dialogRef.close(false);
  }
}
