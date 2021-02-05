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
import {UploadPaymentComponent} from './home/payment/upload-payment/upload-payment.component';
import {ViewPaymentComponent} from './home/payment/view-payment/view-payment.component';
import {ProfileComponent} from './home/profile/profile.component';
import {RequestComponent} from './home/request/request.component';
import {NewModuleComponent} from './home/course-module/new-module/new-module.component';
import {EnrollComponent} from './home/course-module/enroll/enroll.component';
import {ModuleDetailComponent} from './home/course-module/module-detail/module-detail.component';
import {UserGuard} from './_helpers/user.guard';
import {ExamResultsComponent} from './home/results/exam-results/exam-results.component';
import {EditResultComponent} from './home/results/edit-result/edit-result.component';
import {UploadResultComponent} from './home/results/upload-result/upload-result.component';
import {ViewResultComponent} from './home/results/view-result/view-result.component';
import {ModuleAttendanceComponent} from './home/attendance/module-attendance/module-attendance.component';
import {PaymentDetailsComponent} from './home/payment/payment-details/payment-details.component';
import {EditPaymentComponent} from './home/payment/edit-payment/edit-payment.component';
import {SubmitedRequestsComponent} from './home/request/submited-requests/submited-requests.component';
import {AddRequestComponent} from './home/request/add-request/add-request.component';
import {UpdateStatusComponent} from './home/request/update-status/update-status.component';

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
            path: 'module-attendance',
            component: ModuleAttendanceComponent
          },
          {
            path: '',
            redirectTo: 'module-attendance',
            pathMatch: 'full'
          },
          {
            path: 'module-attendance/:moduleCode',
            component: ModuleAttendanceComponent
          },
          {
            path: 'view-attendance',
            component: ViewAttendanceComponent,
            canActivate: [UserGuard]
          },
          {
            path: 'upload-attendance',
            component: UploadAttendanceComponent,
            canActivate: [UserGuard]
          },
          {
            path: 'edit-attendance',
            component: EditAttendanceComponent,
            canActivate: [UserGuard]
          }
        ]
      },
      {
        path: 'course-modules',
        component: CourseModuleComponent,
        children: [
          {
            path: 'module-details',
            component: ModuleDetailComponent
          },
          {
            path: '',
            redirectTo: 'module-details',
            pathMatch: 'full'
          },
          {
            path: 'module-details/:moduleCode',
            component: ModuleDetailComponent
          },
          {
            path: 'new-module',
            component: NewModuleComponent,
            canActivate: [UserGuard]
          },
          {
            path: 'new-module/:moduleCode',
            component: NewModuleComponent,
            canActivate: [UserGuard]
          },
          {
            path: 'enroll',
            component: EnrollComponent,
            canActivate: [UserGuard]
          }]
      },
      {
        path: 'results',
        component: ResultsComponent,
        children: [
          {
            path: 'exam-results',
            component: ExamResultsComponent
          },
          {
            path: '',
            redirectTo: 'exam-results',
            pathMatch: 'full'
          },
          {
            path: 'exam-results:moduleCode',
            component: ExamResultsComponent
          },
          {
            path: 'view-results',
            component: ViewResultComponent,
            canActivate: [UserGuard]
          },
          {
            path: 'upload-results',
            component: UploadResultComponent,
            canActivate: [UserGuard]
          },
          {
            path: 'edit-results',
            component: EditResultComponent,
            canActivate: [UserGuard]
          }
        ]
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
        component: PaymentComponent,
        children: [
          {
            path: 'payment-details',
            component: PaymentDetailsComponent
          },
          {
            path: '',
            redirectTo: 'payment-details',
            pathMatch: 'full'
          },
          {
            path: 'view-payment',
            component: ViewPaymentComponent
          },
          {
            path: 'upload-payment',
            component: UploadPaymentComponent
          },
          {
            path: 'edit-payment',
            component: EditPaymentComponent
          }
        ]
      },
      {
        path: 'registration',
        component: RegistrationComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'request',
        component: RequestComponent,
        children: [
          {
            path: 'submitted-requests',
            component: SubmitedRequestsComponent
          },
          {
            path: '',
            redirectTo: 'submitted-requests',
            pathMatch: 'full'
          },
          {
            path: 'add-request',
            component: AddRequestComponent
          },
          {
            path: 'update-status',
            component: UpdateStatusComponent
          }
        ]
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
        component: VerificationComponent
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
