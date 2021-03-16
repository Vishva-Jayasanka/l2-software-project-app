import {Component, OnInit} from '@angular/core';
import {DataService} from '../../_services/data.service';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../_services/authentication.service';

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
  timeTable;

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
        const timetable = [];
        for (const session of response.times) {
          if (!(session.day in timetable)) {
            timetable[session.day] = [[]];
          }
          timetable[session.day][0].push({
              moduleCode: session.moduleCode,
              moduleName: session.moduleName,
              startingTime: session.startingTime,
              endingTime: session.endingTime,
              type: session.type,
              lectureHall: session.lectureHall
            }
          );
        }

        for (let i = 1; i <= 7; i++) {
          if (i in timetable) {
            let temp = timetable[i][0];
            let isFound: boolean;
            do {
              timetable[i].push([]);
              isFound = false;
              if (temp.length > 1) {
                temp.sort((obj1, obj2) => {
                  const val = this.getPosition(this.convertTime(obj1.startingTime)) - this.getPosition(this.convertTime(obj2.startingTime));
                  if (val === 0) {
                    return this.getPosition(this.convertTime(obj2.endingTime)) - this.getPosition(this.convertTime(obj2.endingTime));
                  }
                  return val;
                });
                const l = timetable[i].length;
                let p = 1;
                const nextTrack = timetable[i][l - 1];
                while (p < temp.length) {
                  if (this.getPosition(this.getTime(temp[p].startingTime)) < this.getPosition(this.getTime(temp[p - 1].endingTime))) {
                    nextTrack.push(temp[p]);
                    temp.splice(p, 1);
                    isFound = true;
                  } else {
                    p++;
                  }
                }
                temp = nextTrack;
              }
            } while (isFound);
            timetable[i].splice(timetable[i].length - 1, 1);
          }
        }
        this.timeTable = timetable;
      },
      error => this.error = error
    ).add(() => this.progress = false);
  }

  getTime(time: string): string {
    return new Date(time).toLocaleTimeString('ISO', {timeZone: 'UTC'});
  }

  getTimeSlots(day: number): any {
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
