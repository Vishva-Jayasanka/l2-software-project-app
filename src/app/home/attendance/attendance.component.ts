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
  batch: number;
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
  disableUpload = true;
  progress = false;
  moduleError = false;
  error = '';
  fileError = false;
  uploadAttendanceError = '';
  uploadAttendanceProgress = true;
  maxDate = new Date();
  attendanceFile;

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
      session: [{value: '', disabled: true}, [Validators.required]],
      date: [{value: '', disabled: true}],
      time: [{value: '', disabled: true}]
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
      batch,
      attendance: [{}]
    };
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
    this.uploadAttendanceProgress = false;
    this.uploadAttendanceError = '';
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
        this.uploadAttendanceError = error;
      }
    ).add(() => this.uploadAttendanceProgress = true);
  }

  getSessions(lectureHourID) {
    this.uploadAttendanceError = '';
    this.uploadAttendanceProgress = false;
    this.data.getSessions(lectureHourID).subscribe(
      response => {
        this.sessions = response.sessions;
        this.session.enable();
        this.elementRef.nativeElement.querySelector('#sessions').focus();
      }, error => {
        this.uploadAttendanceError = error;
      }
    ).add(() => this.uploadAttendanceProgress = true);
  }

  clickFileUpload() {
    document.getElementById('fileUpload').click();
  }

  checkValue(value) {
    if (parseInt(value, 10) === 0) {
      this.date.enable();
      this.time.enable();
      this.disableUpload = false;
    } else {
      this.date.disable();
      this.time.disable();
      this.disableUpload = true;
    }
  }

  onFileChange(ev) {
    this.uploadAttendanceProgress = false;
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      this.attendanceFile = jsonData.Sheet1;
      if (this.attendanceFile[0].hasOwnProperty('index') && this.attendanceFile[0].hasOwnProperty('status')) {
        let isValid = true;
        for (const attendance of this.attendanceFile) {
          if (attendance.index.match(/^[0-9]{6}[A-Za-z]$/) === null || attendance.status !== 0 && attendance.status !== 1) {
            isValid = false;
            break;
          }
        }
        if (isValid) {
          this.attendanceFile.sort((a, b) => a.index > b.index ? 1 : -1);
          this.fileError = false;
        } else {
          this.attendanceFile = '';
          this.fileError = true;
        }
      } else {
        this.attendanceFile = '';
        this.fileError = true;
      }
      this.uploadAttendanceProgress = true;
    };
    reader.readAsBinaryString(file);
  }

  uploadAttendance() {
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

  get date() {
    return this.uploadAttendanceForm.get('date');
  }

  get time() {
    return this.uploadAttendanceForm.get('time');
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
