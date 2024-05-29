import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailNewsRoutingModule } from './detail-news-routing.module';
import { DetailComponent } from './detail/detail.component';


@NgModule({
  declarations: [
    DetailComponent
  ],
  imports: [
    CommonModule,
    DetailNewsRoutingModule
  ]
})
export class DetailNewsModule { }
