import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeCreatePostRouting } from './employee-create-post-routing.module';
import { EmployeeCreatePostComponent } from './employee-create-post/employee-create-post.component';
// import { ImageModule } from 'primeng/image';
import { NgxEditorModule } from 'ngx-editor';
import { GalleryComponent } from './gallery/gallery.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [EmployeeCreatePostComponent, GalleryComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EmployeeCreatePostRouting,
    // ImageModule,
    NgxEditorModule,
    MatDialogModule,
    MatIconModule,
    ClipboardModule,
  ],
})
export class EmployeeCreatePostModule {}
