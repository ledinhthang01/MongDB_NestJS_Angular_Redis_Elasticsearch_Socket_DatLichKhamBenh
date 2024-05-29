import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from './pagination/pagination.component';
import { NoMatchingComponent } from './no-matching/no-matching.component';
import { SearchComponent } from './search/search.component';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { GalleryConfirmsComponent } from './gallery-confirms/gallery-confirms.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    PaginationComponent,
    NoMatchingComponent,
    SearchComponent,
    GalleryConfirmsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    PaginationModule.forRoot(),
  ],
  exports: [
    PaginationComponent,
    NoMatchingComponent,
    SearchComponent,
    GalleryConfirmsComponent,
  ],
})
export class ShareModule {}
