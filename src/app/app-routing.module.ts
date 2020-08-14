import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {AuthenticationGuard} from './_helpers/authentication.guard';

import {HomeComponent} from './home/home.component';
import {LoginComponent} from './auth/login/login.component';
import {VerificationComponent} from './auth/verification/verification.component';
import {AuthComponent} from './auth/auth.component';
import {ForgotPasswordComponent} from './auth/forgot-password/forgot-password.component';
import {AttendanceComponent} from './home/attendance/attendance.component';
import {ResultsComponent} from './home/results/results.component';
import {TimetableComponent} from './home/timetable/timetable.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: 'attendance',
        component: AttendanceComponent
      },
      {
        path: 'results',
        component: ResultsComponent
      },
      {
        path: 'results/:id',
        component: ResultsComponent
      },
      {
        path: 'timetable',
        component: TimetableComponent
      },
      {
        path: '',
        redirectTo: 'results',
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
