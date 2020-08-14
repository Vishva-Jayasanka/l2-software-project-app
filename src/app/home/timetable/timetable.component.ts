import {Component, enableProdMode, OnInit} from '@angular/core';
import {DataService} from '../../_services/data.service';
import {Router} from '@angular/router';

export interface TimeSlot {
  moduleCode: string;
  moduleName: string;
  type: string;
  semester: number;
  start: number;
  end: number;
  day: string;
  lectureHall: string;
  color: string;
}

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css'],
})
export class TimetableComponent implements OnInit {

  weekdays: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  times = new Map([['08:15', 495], ['09:15', 555], ['10:15', 615], ['10:30', 630], ['11:30', 690],
    ['12:30', 750], ['13:15', 795], ['14:15', 855], ['15:15', 915], ['15:30', 930], ['16:30', 990], ['17:30', 1050]
  ]);
  timeSlots = [];
  timeTables = [];
  modules = [];
  lectureHours = [];
  progress = false;
  error = '';

  constructor(
    private router: Router,
    private data: DataService
  ) {
  }

  ngOnInit(): void {
    this.progress = true;
    this.data.getLectureHours().subscribe(
      response => {
        this.modules = response.modules;
        this.lectureHours = response.lectureHours;
        this.createTimetable();
      },
      error => {
        this.error = error;
      }
    ).add(
      () => this.progress = false
    );
  }

  createTimetable() {
    for (const lecture of this.lectureHours) {
      const module = this.modules.find(obj => obj.moduleCode === lecture.moduleCode);
      const timeSlot: TimeSlot = {
        moduleCode: lecture.moduleCode,
        moduleName: module.moduleName,
        type: lecture.type,
        semester: module.semester,
        start: lecture.startingTime,
        end: lecture.endingTime,
        day: lecture.day,
        lectureHall: lecture.lectureHall,
        color: module.colorCode
      };
      this.timeSlots.push(timeSlot);
    }
  }

  getTime(value): string {
    const hours = Math.round(value / 60);
    const minutes = value % 60;
    return ((hours < 10) ? '0' : '') + hours + ':' + ((minutes < 10) ? '0' : '') + minutes;
  }

  getLevel(val) {
    const sem = (val - 1) % 2 + 1;
    const level = Math.floor((val - 1) / 2) + 1;
    return 'L0' + level + 'S0' + sem;
  }

  getTimeSlots(semester: number, day: string) {
    return this.timeSlots.filter(obj => obj.semester === semester && obj.day === day);
  }

  hasRecords(sem: number) {
    return this.timeSlots.filter(obj => obj.semester === sem).length !== 0;
  }

  iterate() {
    return [1, 2, 3, 4];
  }

}
