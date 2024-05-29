import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './chat/list/list.component';
import { DetailComponent } from './chat/detail/detail.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GalleryComponent } from './chat/gallery/gallery.component';
import { MatDialogModule } from '@angular/material/dialog';
import { GallerySearchComponent } from './chat/gallery-search/gallery-search.component';
import { GalleryInfoComponent } from './chat/gallery-info/gallery-info.component';

@NgModule({
  declarations: [
    ListComponent,
    DetailComponent,
    GalleryComponent,
    GallerySearchComponent,
    GalleryInfoComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatDialogModule,
    FormsModule,
  ],
  exports: [ListComponent, DetailComponent],
})
export class GeneralChatModule {}
