import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {AuthenticationGuard} from './_helpers/authentication.guard';

import {HomeComponent} from './home/home.component';
import {LoginComponent} from './auth/login/login.component';
import {VerificationComponent} from './auth/verification/verification.component';
import {AuthComponent} from './auth/auth.component';
import {ForgotPasswordComponent} from './auth/forgot-password/forgot-password.component';
import {AttendanceComponent} from './home/attendance/attendance.component';
import {CourseModuleComponent} from './home/course-module/course-module.component';
import {TimetableComponent} from './home/timetable/timetable.component';
import {UploadAttendanceComponent} from './home/attendance/upload-attendance/upload-attendance.component';
import {EditAttendanceComponent} from './home/attendance/edit-attendance/edit-attendance.component';
import {ViewAttendanceComponent} from './home/attendance/view-attendance/view-attendance.component';
import {PaymentComponent} from './home/payment/payment.component';
import {RegistrationComponent} from './home/registration/registration.component';
import {ResultsComponent} from './home/results/results.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: 'attendance',
        component: AttendanceComponent,
        children: [
          {
            path: 'upload-attendance',
            component: UploadAttendanceComponent,
            canActivate: [AuthenticationGuard]
          },
          {
            path: 'edit-attendance',
            component: EditAttendanceComponent,
            canActivate: [AuthenticationGuard]
          },
          {
            path: 'view-attendance',
            component: ViewAttendanceComponent,
            canActivate: [AuthenticationGuard]
          }
        ]
      },
      {
        path: 'course-modules',
        component: CourseModuleComponent,
      },
      {
        path: 'course-modules/:id',
        component: CourseModuleComponent
      },
      {
        path: 'results',
        component: ResultsComponent
      },
      {
        path: 'results/:moduleCode',
        component: ResultsComponent
      },
      {
        path: 'timetable',
        component: TimetableComponent
      },
      {
        path: 'payment',
        component: PaymentComponent
      },
      {
        path: 'registration',
        component: RegistrationComponent
      },
      {
        path: '',
        redirectTo: 'course-modules',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'verification',
    component: VerificationComponent,
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent
      },
      {
        path: 'verification',
        component: VerificationComponent,
        canActivate: [AuthenticationGuard]
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
