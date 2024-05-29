import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/pages/home/header/header.component';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ScheduleMedicalExaminationComponent } from './components/pages/user/booking/schedule-medical-examination/schedule-medical-examination/schedule-medical-examination.component';
import { ServiceReviewsComponent } from './components/pages/user/booking/schedule-medical-examination/service-reviews/service-reviews.component';
import { RatingModule } from 'ngx-bootstrap/rating';
import { BodyComponent } from './components/pages/home/body/body.component';
import { SpecialListComponent } from './components/pages/home/special-list/special-list.component';
import { UserLayoutComponent } from './components/pages/home/user-layout/user-layout.component';
import { AuthInterceptor } from './interceptor/interceptor';
import { LoadingComponent } from './components/pages/common/loading/loading.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { MatIconModule } from '@angular/material/icon';

const config: SocketIoConfig = { url: 'http://localhost:3002', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ScheduleMedicalExaminationComponent,
    ServiceReviewsComponent,
    BodyComponent,
    SpecialListComponent,
    UserLayoutComponent,
    LoadingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    FormsModule,
    HttpClientModule,
    SocketIoModule.forRoot(config),
    BrowserAnimationsModule,
    ReactiveFormsModule,
    CarouselModule.forRoot(),
    MatIconModule,
    BsDatepickerModule.forRoot(), // thuoc ScheduleMedicalExaminationComponent, thay vi tri khi su routing
    RatingModule.forRoot(), // thuoc ScheduleMedicalExaminationComponent, thay vi tri khi su routing
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
