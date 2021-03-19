import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {MaterialModule} from './_material/material.module';
import {EjsModule} from './_ejs/ejs.module';
import {AppRoutingModule} from './app-routing.module';

import {AuthenticationService} from './_services/authentication.service';
import {AuthenticationGuard} from './_helpers/authentication.guard';

import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './auth/login/login.component';
import {TokenInterceptor} from './_helpers/token.interceptor';
import {ErrorInterceptor} from './_helpers/error.interceptor';
import {VerificationComponent} from './auth/verification/verification.component';
import {AuthComponent} from './auth/auth.component';
import {ForgotPasswordComponent} from './auth/forgot-password/forgot-password.component';
import {AttendanceComponent} from './home/attendance/attendance.component';
import {CourseModuleComponent, DeleteModuleDialogComponent} from './home/course-module/course-module.component';
import {TimetableComponent} from './home/timetable/timetable.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {UploadAttendanceComponent} from './home/attendance/upload-attendance/upload-attendance.component';
import {EditAttendanceComponent} from './home/attendance/edit-attendance/edit-attendance.component';
import {ViewAttendanceComponent} from './home/attendance/view-attendance/view-attendance.component';
import {PaymentComponent} from './home/payment/payment.component';
import {NotificationComponent} from './home/notification/notification.component';
import {RegistrationComponent} from './home/registration/registration.component';
import {ResultsComponent} from './home/results/results.component';
import {UploadResultComponent} from './home/results/upload-result/upload-result.component';
import {EditResultComponent} from './home/results/edit-result/edit-result.component';
import {ViewResultComponent} from './home/results/view-result/view-result.component';
import {ProfileComponent} from './home/profile/profile.component';
import {ProfilePictureComponent} from './home/profile/profile-picture/profile-picture.component';
import {ImageCropperModule} from 'ngx-image-cropper';
import {UploadPaymentComponent} from './home/payment/upload-payment/upload-payment.component';
import {ViewPaymentComponent} from './home/payment/view-payment/view-payment.component';
import {ComposerComponent} from './home/notification/composer/composer.component';
import {RequestComponent} from './home/request/request.component';
import {AddRequestComponent} from './home/request/add-request/add-request.component';
import {UpdateStatusComponent} from './home/request/update-status/update-status.component';
import {EnrollComponent} from './home/course-module/enroll/enroll.component';
import {NewModuleComponent} from './home/course-module/new-module/new-module.component';
import {ModuleDetailComponent} from './home/course-module/module-detail/module-detail.component';
import {UserGuard} from './_helpers/user.guard';
import {ExamResultsComponent} from './home/results/exam-results/exam-results.component';
import {
  AttendanceDialogComponent,
  ModuleAttendanceComponent
} from './home/attendance/module-attendance/module-attendance.component';
import { EditPaymentComponent } from './home/payment/edit-payment/edit-payment.component';
import { PaymentDetailsComponent } from './home/payment/payment-details/payment-details.component';
import { SubmitedRequestsComponent } from './home/request/submited-requests/submited-requests.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    VerificationComponent,
    AuthComponent,
    ForgotPasswordComponent,
    CourseModuleComponent,
    TimetableComponent,
    DeleteModuleDialogComponent,
    AttendanceComponent,
    UploadAttendanceComponent,
    EditAttendanceComponent,
    ViewAttendanceComponent,
    AttendanceDialogComponent,
    NotificationComponent,
    PaymentComponent,
    NotificationComponent,
    RegistrationComponent,
    ResultsComponent,
    UploadResultComponent,
    EditResultComponent,
    ViewResultComponent,
    ProfileComponent,
    ProfilePictureComponent,
    UploadPaymentComponent,
    ViewPaymentComponent,
    ComposerComponent,
    RequestComponent,
    AddRequestComponent,
    UpdateStatusComponent,
    EnrollComponent,
    NewModuleComponent,
    ModuleDetailComponent,
    ExamResultsComponent,
    ModuleAttendanceComponent,
    EditPaymentComponent,
    PaymentDetailsComponent,
    SubmitedRequestsComponent,
    ResetPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    EjsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatAutocompleteModule,
    ImageCropperModule
  ],
  providers: [
    AuthenticationGuard,
    UserGuard,
    AuthenticationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
