import {Component, HostListener, OnInit} from '@angular/core';
import {AuthenticationService} from '../_services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  width: boolean;
  activeRoute: string;
  user;
  ROUTS = [
    {component: 'ResultsComponent', route: 'results', icon: 'grade', label: 'Course Modules'},
    {component: 'AttendanceComponent', route: 'attendance', icon: 'assignment_turned_in', label: 'Attendance'},
    {component: 'TimetableComponent', route: 'timetable', icon: 'schedule', label: 'Timetable'}
  ];

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.width = event.target.innerWidth < 950;
  }

  constructor(
    private authentication: AuthenticationService
  ) {
    this.width = (window.innerWidth) < 950;
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
