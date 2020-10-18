import {Component, ElementRef, Inject, OnInit} from '@angular/core';
import {DataService} from '../../_services/data.service';
import {Router} from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {AuthenticationService} from '../../_services/authentication.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LectureHour} from '../results/results.component';
import * as XLSX from 'xlsx';

export interface Attendance {
  moduleName: string;
  moduleCode: string;
  attendance: [{
    batch: number;
    type: string;
    percentage: number;
  }];
}

export interface DetailedAttendance {
  moduleCode: string;
  moduleName: string;
  type: string;
  batch: number;
  attendance: [{}];
}

export interface Session {
  sessionID: number;
  dateHeld: Date;
}

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {

  attendance: Attendance[] = [];
  filteredAttendance: Attendance[] = [];
  detailedAttendance: DetailedAttendance;

  progress = false;
  attendanceError = '';

  constructor(
    private router: Router,
    private data: DataService,
    private formBuilder: FormBuilder,
    private authentication: AuthenticationService,
    private elementRef: ElementRef,
    public dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.progress = true;
    this.data.getAttendance().subscribe(
      response => this.getAttendance(response.attendance),
      error => this.attendanceError = error
    ).add(() => this.progress = false);
  }

  getAttendance(response) {
    for (const attendance of response) {
      const temp = this.attendance.find(value => value.moduleCode === attendance.moduleCode);
      if (temp !== undefined) {
        temp.attendance.push({
          batch: attendance.batch,
          type: attendance.type,
          percentage: this.calculateAttendance(attendance.total, attendance.count)
        });
      } else {
        this.attendance.push({
          moduleCode: attendance.moduleCode,
          moduleName: attendance.moduleName,
          attendance: [{
            batch: attendance.batch,
            type: attendance.type,
            percentage: this.calculateAttendance(attendance.total, attendance.count)
          }]
        });
      }
    }
    this.filteredAttendance = Object.assign([], this.attendance);
  }

  calculateAttendance(total, count) {
    return Math.round((total - count) * 100 / total);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    if (filterValue) {
      this.filteredAttendance = this.attendance.filter(
        obj => obj.moduleCode.toLowerCase().includes(filterValue) || obj.moduleName.toLowerCase().includes(filterValue)
      );
    } else {
      this.filteredAttendance = this.attendance;
    }
  }

  openDialog(moduleCode: string, moduleName: string, type: string, batch: number): void {
    this.detailedAttendance = {
      moduleCode,
      moduleName,
      type,
      batch,
      attendance: [{}]
    };
    const dialogRef = this.dialog.open(AttendanceDialogComponent, {
      width: '500px',
      data: this.detailedAttendance
    });
  }

  get getRole() {
    return this.authentication.details.role;
  }

}


@Component({
  selector: 'app-attendance-dialog',
  templateUrl: './attendance-dialog.component.html',
  styleUrls: ['./attendance.component.css']
})

export class AttendanceDialogComponent implements OnInit {

  error = false;
  progress = false;

  constructor(
    private dataService: DataService,
    public dialogRef: MatDialogRef<AttendanceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DetailedAttendance
  ) {
  }

  ngOnInit() {
    this.progress = true;
    this.dataService.getDetailedAttendance(this.data.moduleCode, this.data.type, this.data.batch).subscribe(
      response => {
        for (const session of response) {
          this.data.attendance.push({
            date: session.dateHeld,
            status: session.status
          });
        }
      }, error => {
        this.error = true;
      }
    ).add(() => this.progress = false);
    this.data.attendance.shift();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
