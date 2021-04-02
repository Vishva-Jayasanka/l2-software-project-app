import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DataService} from '../../../_services/data.service';
import {EventSettingsModel, MonthService, WeekService, WorkWeekService} from '@syncfusion/ej2-angular-schedule';
import {DataManager, WebApiAdaptor} from '@syncfusion/ej2-data';

@Component({
  selector: 'app-academic-timetable',
  providers: [WeekService, MonthService, WorkWeekService],
  templateUrl: './academic-timetable.component.html',
  styleUrls: ['../timetable.component.css', './academic-timetable.component.css']
})
export class AcademicTimetableComponent implements OnInit {

  progress = false;
  error = '';

  defaultData = [];

  public selectedDate: Date = new Date(2021, 3, 3);
  private dataManager: DataManager = new DataManager({
    url: 'http://localhost:3000/api/get-timetable/100000R/1',
    adaptor: new WebApiAdaptor(),
    crossDomain: true
  });
  public workWeek: number[] = [0, 6];
  public eventSettings: EventSettingsModel = {
    dataSource: this.dataManager,
    fields: {
      id: 'Id',
      subject: {name: 'Subject'},
      startTime: {name: 'StartTime'},
      endTime: {name: 'EndTime'},
      description: {name: 'Description'},
      location: {name: 'LectureHall'}
    }
  };


  constructor(
    public router: Router,
    public data: DataService
  ) {
  }

  onDataBinding(event: { [key: string]: object }): void {
    const items: { [key: string]: object }[] = (event.result as { [key: string]: object }[]);
    const scheduleData: object[] = [];
    // @ts-ignore
    const url = new URL(event.xhr.responseURL);
    const startDate: Date = new Date(url.searchParams.get('StartDate'));
    let endDate: Date = new Date(url.searchParams.get('EndDate'));
    endDate = new Date(endDate.setDate(endDate.getDate() - 1));
    console.log(endDate);
    if (items.length > 0) {
      items.forEach(item => {

        let year;
        let month;
        let day;

        if (parseInt(item.day.toString(), 10) === 0) {
          year = startDate.getFullYear();
          month = startDate.getMonth();
          day = startDate.getDate();
        } else {
          year = endDate.getFullYear();
          month = endDate.getMonth();
          day = endDate.getDate();
        }

        let temp = new Date(item.StartTime.toString());
        const startTime = new Date(year, month, day, temp.getHours(), temp.getMinutes(), 0);
        item.StartTime = new Date(startTime.setMinutes(startTime.getMinutes() - 330));

        temp = new Date(item.EndTime.toString());
        const endTime = new Date(year, month, day, temp.getHours(), temp.getMinutes(), 0);
        item.EndTime = new Date(endTime.setMinutes(endTime.getMinutes() - 330));

        scheduleData.push(item);

      });
    }
  }

  ngOnInit(): void {

    // this.data.getTimetable().subscribe(
    //   response => {
    //     console.log(response);
    //   },
    //   error => {
    //     console.error(error);
    //   }
    // );
  }

}
