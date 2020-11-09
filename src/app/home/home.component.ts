import {Component, HostListener, OnInit, Sanitizer} from '@angular/core';
import {AuthenticationService} from '../_services/authentication.service';
import {MatDialog} from '@angular/material/dialog';
import {ProfilePictureComponent} from './profile/profile-picture/profile-picture.component';
import {DataService} from '../_services/data.service';
import {UserDataService} from '../_services/user-data.service';

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
    {component: 'CourseModuleComponent', route: 'course-modules', icon: 'grade', label: 'Course Modules'},
    {component: 'ResultsComponent', route: 'results', icon: 'assessment', label: 'Exam Results'},
    {component: 'AttendanceComponent', route: 'attendance', icon: 'assignment_turned_in', label: 'Attendance'},
    {component: 'TimetableComponent', route: 'timetable', icon: 'watch_later', label: 'Timetable'},
    {component: 'PaymentComponent', route: 'payment', icon: 'monetization_on', label: 'Payment'},
    {component: 'RequestComponent', route: 'request', icon: 'description', label: 'Requests'}
  ];
  ADMIN_ROUTS = [
    {component: 'RegistrationComponent', route: 'registration', icon: 'how_to_reg', label: 'Registration'}
  ];

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.widthSidenav = event.target.innerWidth < 850;
    this.widthNotification = event.target.innerWidth < 1170;
  }

  constructor(
    private authentication: AuthenticationService,
    public dialog: MatDialog,
    private data: DataService,
    public userData: UserDataService
  ) {
    this.widthSidenav = (window.innerWidth) < 850;
    this.widthNotification = (window.innerWidth) < 1170;
  }

  ngOnInit(): void {
    this.user = this.authentication.details;
    this.data.getProfilePicture().subscribe(
      response => {
        this.userData.changeProfilePicture('data:image/jpeg;base64,' + response.profilePicture);
      },
      error => console.log(error)
    );
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
