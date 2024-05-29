import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ScheduleMedicalExaminationComponent } from './components/pages/user/booking/schedule-medical-examination/schedule-medical-examination/schedule-medical-examination.component';
import { BodyComponent } from './components/pages/home/body/body.component';
import { ServiceReviewsComponent } from './components/pages/user/booking/schedule-medical-examination/service-reviews/service-reviews.component';
import { UserLayoutComponent } from './components/pages/home/user-layout/user-layout.component';
import { authGuard } from './components/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      { path: '', component: BodyComponent },
      { path: 'user', redirectTo: '', pathMatch: 'full' },
      {
        path: 'auth',
        loadChildren: () =>
          import('./components/pages/auth/auth.module').then(
            (m) => m.AuthModule
          ),
        pathMatch: 'full',
      },
      {
        path: 'news',
        loadChildren: () =>
          import('./components/pages/user/news/news.module').then(
            (m) => m.NewsModule
          ),
      },
      {
        path: 'search',
        loadChildren: () =>
          import('./components/pages/user/userSearch/userSearch.module').then(
            (m) => m.UserSearchModule
          ),
        pathMatch: 'full',
      },
      {
        path: 'health-services',
        loadChildren: () =>
          import(
            './components/pages/user/list-services/list-services.module'
          ).then((m) => m.ListServicesModule),
        pathMatch: 'full',
      },
      {
        path: 'booking',
        loadChildren: () =>
          import('./components/pages/user/booking/booking.module').then(
            (m) => m.BookingModule
          ),
      },
      {
        path: 'hospital',
        loadChildren: () =>
          import('./components/pages/user/hospital/hospital.module').then(
            (m) => m.BookingModule
          ),
        pathMatch: 'full',
      },
      {
        path: 'info-user',
        loadChildren: () =>
          import('./components/pages/user/user-info/user-info.module').then(
            (m) => m.UserInfoModule
          ),
        canActivate: [authGuard],
      },
      // {
      //   path: 'schedule-medical-examination',
      //   component: ScheduleMedicalExaminationComponent,
      // },
      // { path: 'service-reviews', component: ServiceReviewsComponent },
    ],
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./components/pages/admin/admin.module').then(
        (m) => m.AdminModule
      ),
    canActivate: [authGuard],
  },
  {
    path: 'employee',
    loadChildren: () =>
      import('./components/pages/employee/employee.module').then(
        (m) => m.EmployeeModule
      ),
    canActivate: [authGuard],
  },
  {
    path: 'center',
    loadChildren: () =>
      import('./components/pages/center/center.module').then(
        (m) => m.CenterModule
      ),
    canActivate: [authGuard],
  },
  {
    path: 'doctor',
    loadChildren: () =>
      import('./components/pages/doctor/doctor.module').then(
        (m) => m.DoctorModule
      ),
    canActivate: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
