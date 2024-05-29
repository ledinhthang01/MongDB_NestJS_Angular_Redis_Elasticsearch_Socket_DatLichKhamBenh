import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewsComponent } from './news/news.component';
import { NewsRoutingModule } from './news-routing.module';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [NewsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NewsRoutingModule,
    MatIconModule,
  ],
})
export class NewsModule {}
