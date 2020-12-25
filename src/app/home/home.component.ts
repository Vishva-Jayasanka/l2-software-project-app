import {Component, HostListener, OnInit, Sanitizer} from '@angular/core';
import {AuthenticationService} from '../_services/authentication.service';
import {MatDialog} from '@angular/material/dialog';
import {ProfilePictureComponent} from './profile/profile-picture/profile-picture.component';
import {DataService} from '../_services/data.service';
import {UserDataService} from '../_services/user-data.service';
import {NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  widthSidenav: boolean;
  widthNotification: boolean;
  activeRoute: string;
  hidden = false;
  user;
  ROUTS = [
    {
      component: 'CourseModuleComponent',
      route: 'course-modules',
      icon: 'grade',
      label: 'Course Modules',
      children: [{
        component: 'NewModuleComponent',
        route: 'new-module',
        label: 'Add New Module'
      }, {
        component: 'EnrollComponent',
        route: 'enroll',
        label: 'Enroll Students'
      }]
    }, {
      component: 'ResultsComponent',
      route: 'results',
      icon: 'assessment',
      label: 'Exam Results',
      children: [{
        component: 'ViewResultComponent',
        route: 'view-results',
        label: 'View Results'
      }, {
        component: 'UploadResultComponent',
        route: 'upload-results',
        label: 'Upload Results'
      }, {
        component: 'EditResultComponent',
        route: 'edit-results',
        label: 'Edit Results'
      }]
    }, {
      component: 'AttendanceComponent',
      route: 'attendance',
      icon: 'assignment_turned_in',
      label: 'Attendance',
      children: [{
        component: 'ViewAttendance',
        route: 'view-attendance',
        label: 'View Attendance'
      }, {
        component: 'UploadAttendance',
        route: 'upload-attendance',
        label: 'Upload Attendance'
      }, {
        component: 'EditAttendance',
        route: 'edit-attendance',
        label: 'Edit Attendance'
      }]
    }, {
      component: 'TimetableComponent',
      route: 'timetable',
      icon: 'watch_later',
      label: 'Timetable',
      children: []
    }, {
      component: 'PaymentComponent',
      route: 'payment',
      icon: 'monetization_on',
      label: 'Payment',
      children: [{
        component: 'ViewPaymentComponent',
        route: 'view-payment',
        label: 'View Payment'
      }, {
        component: 'UploadPaymentComponent',
        route: 'upload-payment',
        label: 'Upload Payment'
      }, {
        component: 'EditPaymentComponent',
        route: 'edit-payment',
        label: 'Edit Payment'
      }]
    }, {
      component: 'RequestComponent',
      route: 'request',
      icon: 'description',
      label: 'Requests',
      children: [{
        component: 'AddRequestComponent',
        route: 'add-request',
        label: 'Add Request'
      }, {
        component: 'UpdateStatusComponent',
        route: 'update-status',
        label: 'Update Status'
      }]
    }, {
      component: 'RegistrationComponent',
      route: 'registration',
      icon: 'how_to_reg',
      label: 'Registration',
      children: []
    }
  ];

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.widthSidenav = event.target.innerWidth < 850;
    this.widthNotification = event.target.innerWidth < 1170;
  }

  constructor(
    private router: Router,
    private authentication: AuthenticationService,
    public dialog: MatDialog,
    private data: DataService,
    public userData: UserDataService
  ) {
    this.widthSidenav = (window.innerWidth) < 850;
    this.widthNotification = (window.innerWidth) < 1170;
    // this.router.events.subscribe(event => {
    //   if (event instanceof NavigationEnd) {
    //      this.activeRoute = event.urlAfterRedirects.split('/')[2];
    //   }
    // });
  }

  ngOnInit(): void {
    this.user = this.authentication.details;
    this.data.getProfilePicture().subscribe(
      response => {
        this.userData.changeProfilePicture('data:image/jpeg;base64,' + response.profilePicture);
      },
      error => console.log(error)
    );
    console.log(this.router.url);
  }

  openDialog() {
    const dialogRef = this.dialog.open(ProfilePictureComponent, {
      panelClass: 'custom-dialog-container',
      width: '500px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  getRoute(event: any) {
    this.activeRoute = event.constructor.name;
  }

  get getRole() {
    return this.authentication.details.role;
  }

  logout() {
    this.authentication.logout();
  }

}
