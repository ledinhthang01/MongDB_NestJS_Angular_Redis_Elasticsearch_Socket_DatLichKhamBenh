import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListServicesRoutingModule } from './list-services-routing.module';
import { ListServicesComponent } from './list-services.component';
import { ServiceItemComponent } from './service-item/service-item.component';

@NgModule({
    declarations: [ListServicesComponent, ServiceItemComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ListServicesRoutingModule
    ]
})
export class ListServicesModule { }
