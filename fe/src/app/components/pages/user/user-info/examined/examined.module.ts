import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExaminedRoutingModule } from './examined-routing.module';
import { ExaminedComponent } from './examined/examined.component';


@NgModule({
  declarations: [
    ExaminedComponent
  ],
  imports: [
    CommonModule,
    ExaminedRoutingModule
  ]
})
export class ExaminedModule { }
