import {Component, Inject, OnInit} from '@angular/core';
import {DataService} from '../../_services/data.service';
import {Router} from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Sort} from '@angular/material/sort';

export interface AttendanceData {
  moduleName: string;
  moduleCode: string;
  dates: [];
  absentDays: [];
}

export interface Attendance {
  moduleCode: string;
  moduleName: string;
  level: number;
  semester: number;
  type: string;
  value: number;
}

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {

  attendance = [];
  modules = [];
  moduleNames = [];
  currentModules = [];
  calculatedAttendance = [];
  displayedAttendance = [];
  sortedData: Attendance[];
  progress = false;
  error = '';

  constructor(
    private router: Router,
    private data: DataService,
    public dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.progress = true;
    this.data.getAttendance().subscribe(
      response => {
        this.attendance = response.attendance;
        this.modules = response.completedLectures;
        this.moduleNames = response.moduleNames;
        this.currentModules = response.currentRegistrations;
        this.getAttendance();
        this.sortedData = this.calculatedAttendance.slice();
      },
      error => {
        this.error = error;
      }
    ).add(
      () => this.progress = false
    );
  }

  getAttendance() {
    for (const module of this.modules) {
      const moduleDetails = this.moduleNames.find(obj => obj.moduleCode === module.moduleCode);
      this.calculatedAttendance.push({
        moduleCode: module.moduleCode,
        moduleName: moduleDetails.moduleName,
        level: this.getLevel(moduleDetails.semester),
        type: module.type,
        value: this.calculateAttendance(module.completedLectures.length, module.moduleCode, module.type)
      });
    }
    this.displayedAttendance = this.calculatedAttendance;
  }

  getLevel(val): string {
    const sem = (val + 1) % 2 + 1;
    const level = Math.floor(val / 2) + 1;
    return 'L0' + level + 'S0' + sem;
  }

  calculateAttendance(total: number, moduleCode: string, type: string) {
    return Math.round((total - this.attendance.filter(attendance => attendance.moduleCode === moduleCode && attendance.type === type)
      .length) * 100 / total);
  }

  sortData(sort: Sort) {
    const data = this.displayedAttendance.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }
    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'moduleCode' :
          return compare(a.moduleCode, b.moduleCode, isAsc);
        case 'moduleName' :
          return compare(a.moduleName, b.moduleName, isAsc);
        case 'level' :
          return compare(a.level, b.level, isAsc);
        case 'type' :
          return compare(a.type, b.type, isAsc);
        case 'attendance' :
          return compare(a.value, b.value, isAsc);
        default:
          return 0;
      }
    });

    function compare(a: number | string, b: number | string, isAsc: boolean) {
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

  }

  getCurrentRegistrations(value: boolean) {
    this.displayedAttendance = this.calculatedAttendance.filter(obj => this.currentModules.includes(obj.moduleCode) || !value);
    this.sortedData = this.displayedAttendance;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    if (filterValue) {
      this.sortedData = this.displayedAttendance.filter(obj => obj.moduleCode.toLowerCase().includes(filterValue)
        || obj.moduleName.toLowerCase().includes(filterValue) || obj.type.toLowerCase().includes(filterValue)
        || obj.value.toString().includes(filterValue));
    } else {
      this.sortedData = this.displayedAttendance;
    }
  }

  openDialog(name, code, type): void {
    const days = [];
    for (const record of this.attendance) {
      if (record.moduleCode === code && record.type === type) {
        days.push(record.date);
      }
    }
    const dialogRef = this.dialog.open(AttendanceDialogComponent, {
      width: '500px',
      data: {
        moduleName: name,
        moduleCode: code,
        dates: this.modules.find(module => module.moduleCode === code && module.type === type).completedLectures,
        absentDays: days
      }
    });
  }

}

@Component({
  selector: 'app-attendance-dialog',
  templateUrl: './attendance-dialog.component.html',
  styleUrls: ['./attendance.component.css']
})

export class AttendanceDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AttendanceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AttendanceData
  ) {
  }

  ngOnInit() {
    console.log(this.data.moduleName);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  isAbsent(date: string) {
    return !(this.data.absentDays.find(day => day === date));
  }

}
