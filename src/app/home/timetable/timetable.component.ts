import {Component, OnInit} from '@angular/core';
import {DataService} from '../../_services/data.service';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../_services/authentication.service';

export interface TimeSlot {
  moduleCode: string;
  moduleName: string;
  type: string;
  startingTime: string;
  endingTime: string;
  day: number;
  lectureHall: string;
}

export interface TimeTable {
  timeSlots: TimeSlot[];
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

  progress = false;
  times: TimeSlot[] = [];

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
        response.times.forEach(timeSlot => {
          this.times.push({
            moduleCode: timeSlot.moduleCode,
            moduleName: timeSlot.moduleName,
            type: timeSlot.type,
            startingTime: this.getTime(timeSlot.startingTime),
            endingTime: this.getTime(timeSlot.endingTime),
            day: timeSlot.day,
            lectureHall: timeSlot.lectureHall
          });
        });
      },
      error => {
        this.error = error;
      }
    ).add(() => this.progress = false);
  }

  getTime(time: string): string {
    return new Date(time).toLocaleTimeString('ISO', {timeZone: 'UTC'});
  }

  getTimeSlots(day: number) {
    return this.times.filter(time => time.day === day);
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
