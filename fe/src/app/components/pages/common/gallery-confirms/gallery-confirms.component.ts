import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RegisterGalleryComponent } from '../../doctor/register-plan/register-gallery/register-gallery.component';
import { MScheduleForAd } from 'src/app/shared/models/schedule';

@Component({
  selector: 'app-gallery-confirms',
  templateUrl: './gallery-confirms.component.html',
  styleUrls: ['./gallery-confirms.component.scss']
})
export class GalleryConfirmsComponent {
  constructor(
    public dialogRef: MatDialogRef<RegisterGalleryComponent>,
    @Inject(MAT_DIALOG_DATA) public dataParent: any,
  ) {
    this.size = dataParent?.size;
    this.data = dataParent?.data;
    this.isDelete = dataParent?.isDelete
    this.dialogRef.updateSize(this.size.w, this.size.h)
  }
  size: any;
  data!: MScheduleForAd;
  isDelete!: boolean

  confirm() {
    this.dialogRef.close(this.data._id)
  }

  cancel() {
    this.dialogRef.close()
  }
}
