import {Component, HostListener, OnInit} from '@angular/core';
import {AuthenticationService} from '../_services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  widthSidenav: boolean;
  widthNotification: boolean;
  activeRoute: string;
  user;
  ROUTS = [
    {component: 'CourseModuleComponent', route: 'course-modules', icon: 'grade', label: 'Course Modules'},
    {component: 'ResultComponent', route: 'results', icon: 'assessment', label: 'Exam Results'},
    {component: 'AttendanceComponent', route: 'attendance', icon: 'assignment_turned_in', label: 'Attendance'},
    {component: 'TimetableComponent', route: 'timetable', icon: 'watch_later', label: 'Timetable'},
    {component: 'PaymentComponent', route: 'payment', icon: 'monetization_on', label: 'Payment'},
    {component: 'RegistrationComponent', route: 'registration', icon: 'how_to_reg', label: 'Registration'}
  ];

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.widthSidenav = event.target.innerWidth < 850;
    this.widthNotification = event.target.innerWidth < 1170;
  }

  constructor(
    private authentication: AuthenticationService
  ) {
    this.widthSidenav = (window.innerWidth) < 850;
    this.widthNotification = (window.innerWidth) < 1170;
  }

  ngOnInit(): void {
    this.user = this.authentication.details;
  }

  getRoute(event: any) {
    this.activeRoute = event.constructor.name;
  }

  logout() {
    this.authentication.logout();
  }

}
