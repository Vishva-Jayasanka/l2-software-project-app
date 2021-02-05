import {Component, OnInit} from '@angular/core';
import {DataService} from '../../_services/data.service';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../_services/authentication.service';

export interface Day {
  day: number;
  timeSlots: TimeSlot[];
}

export interface TimeSlot {
  startingTime: string;
  endingTime: string;
  sessions: Session[];
}

export interface Session {
  moduleCode: string;
  moduleName: string;
  type: string;
  lectureHall: string;
}

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css'],
})
export class TimetableComponent implements OnInit {

  weekdays = [
    {index: 2, day: 'Monday'},
    {index: 3, day: 'Tuesday'},
    {index: 4, day: 'Wednesday'},
    {index: 5, day: 'Thursday'},
    {index: 6, day: 'Friday'}
  ];
  timeTable: Day[] = [];

  progress = false;

  error = '';

  constructor(
    public router: Router,
    private data: DataService,
    private authentication: AuthenticationService
  ) {
  }

  ngOnInit(): void {
    this.progress = true;
    this.data.getTimetable().subscribe(
      response => {
        for (const session of response.times) {
          console.log(session.moduleCode + ' ' + session.type + ' ' + this.getPosition(this.getTime(session.startingTime)) + ' ' + this.getPosition(this.getTime(session.endingTime)));
        }
        // const temp = response.times;
        // temp.sort((s1, s2) => this.convertTime(s1.startingTime) > this.convertTime(s2.startingTime) ? 0 : -1);
        // for (const day of this.weekdays) {
        //   for (let i = 0; i < temp.length; i++) {
        //     if ()
        //   }
        // }
      },
      error => this.error = error
    ).add(() => this.progress = false);
  }

  getTime(time: string): string {
    return new Date(time).toLocaleTimeString('ISO', {timeZone: 'UTC'});
  }

  getTimeSlots(day: number): TimeSlot[] {
    return this.timeTable.filter(time => time.day === day).map(value => value.timeSlots)[0];
  }

  getRole() {
    return this.authentication.details.role;
  }

  convertTime(time: string): string {
    const components = time.split(/[\s:]/);
    return components[0] + ':' + components[1] + ' ' + components[3];
  }

  getPosition(time: string): number {
    const components = time.split(/[\s:]/);
    return parseInt(components[0], 10) * 60 + parseInt(components[1], 10) +
      ((components[3] === 'PM' && components[0] !== '12') ? 720 : 0) - 495;
  }

}
