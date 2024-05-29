import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SigninupComponent } from './Signinup/signinup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { GalleryComponent } from './gallery/gallery.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FogotGalleryComponent } from './fogot-gallery/fogot-gallery.component';

@NgModule({
    declarations: [SigninupComponent, GalleryComponent, FogotGalleryComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AuthRoutingModule,
        BsDatepickerModule.forRoot(),
        MatDialogModule
    ]
})
export class AuthModule { }
