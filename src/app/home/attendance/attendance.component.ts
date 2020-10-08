import {Component, ElementRef, Inject, OnInit} from '@angular/core';
import {DataService} from '../../_services/data.service';
import {Router} from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {AuthenticationService} from '../../_services/authentication.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LectureHour} from '../results/results.component';

export interface Attendance {
  moduleName: string;
  moduleCode: string;
  batch: number;
  attendance: [{
    type: string;
    percentage: number;
  }];
}

export interface DetailedAttendance {
  moduleCode: string;
  moduleName: string;
  type: string;
  attendance: [{}];
}

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {

  attendance: Attendance[] = [];
  filteredAttendance: Attendance[] = [];
  lectureHours: LectureHour[] = [];
  sessions: [];
  detailedAttendance: DetailedAttendance;
  uploadAttendanceForm: FormGroup;
  moduleExists = true;
  progress = false;
  moduleError = false;
  error = '';

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
    this.uploadAttendanceForm = this.formBuilder.group({
      moduleCode: ['', [Validators.required, Validators.pattern(/^[A-Za-z]{2}[0-9]{4}/)]],
      moduleName: [''],
      lectureHour: [{value: '', disabled: true}, [Validators.required]],
      session: [{value: '', disabled: true}, [Validators.required]]
    });
    this.data.getAttendance().subscribe(
      response => {
        this.getAttendance(response);
      },
      error => {
        this.error = error;
      }
    ).add(
      () => this.progress = false
    );
  }

  getAttendance(response) {
    for (const attendance of response) {
      let temp;
      if ((temp = this.attendance.filter(value => value.moduleCode === attendance.moduleCode)).length > 0) {
        temp[0].attendance.push({
          type: attendance.type,
          percentage: this.calculateAttendance(attendance.total, attendance.count)
        });
      } else {
        this.attendance.push({
          moduleCode: attendance.moduleCode,
          moduleName: attendance.moduleName,
          batch: attendance.batch,
          attendance: [{
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
      attendance: [{}]
    };
    this.data.getDetailedAttendance(moduleCode, type, batch).subscribe(
      response => {
        for (const session of response) {
          this.detailedAttendance.attendance.push({
            date: session.dateHeld,
            status: session.status
          });
        }
      }, error => {
        this.detailedAttendance = null;
      }
    );
    this.detailedAttendance.attendance.shift();
    const dialogRef = this.dialog.open(AttendanceDialogComponent, {
      width: '500px',
      data: this.detailedAttendance
    });
  }

  checkIfModuleExists(moduleCode: string) {
    this.data.checkIfModuleExists(moduleCode).subscribe(
      response => {
        if (response) {
          this.moduleCode.setErrors({incorrect: false});
          this.lectureHour.disable();
          this.session.disable();
          this.moduleName.setValue('');
          this.moduleExists = false;
        }
      }, error => {
        console.error(error);
      }
    );
  }

  getLectureHoursOfModule() {
    this.data.getLectureHoursOfModule(this.uploadAttendanceForm.get('moduleCode').value).subscribe(
      response => {
        this.moduleName.setValue(response.moduleName);
        if (response.lectureHours.length !== 0) {
          this.lectureHour.enable();
          this.session.disable();
          this.sessions = [];
          this.lectureHours = response.lectureHours;
          this.elementRef.nativeElement.querySelector('#lectureHours').focus();
          this.moduleError = false;
        } else {
          this.moduleCode.setErrors({invalid: false});
          this.moduleError = true;
        }
      }, error => {
        this.error = error;
      }
    );
  }

  getSessions(lectureHourID) {
    this.data.getSessions(lectureHourID).subscribe(
      response => {
        this.sessions = response.sessions;
        this.session.enable();
        this.elementRef.nativeElement.querySelector('#sessions').focus();
      }, error => {
        console.error(error);
      }
    );
  }

  get getRole() {
    return this.authentication.details.role;
  }

  get moduleCode() {
    return this.uploadAttendanceForm.get('moduleCode');
  }

  get moduleName() {
    return this.uploadAttendanceForm.get('moduleName');
  }

  get lectureHour() {
    return this.uploadAttendanceForm.get('lectureHour');
  }

  get session() {
    return this.uploadAttendanceForm.get('session');
  }

}


@Component({
  selector: 'app-attendance-dialog',
  templateUrl: './attendance-dialog.component.html',
  styleUrls: ['./attendance.component.css']
})

export class AttendanceDialogComponent implements OnInit {

  error = false;

  constructor(
    public dialogRef: MatDialogRef<AttendanceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DetailedAttendance
  ) {
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
