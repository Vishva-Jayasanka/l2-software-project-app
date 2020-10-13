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
  lectureHours: LectureHour[] = [];
  sessions: Session[] = [];

  detailedAttendance: DetailedAttendance;
  uploadAttendanceForm: FormGroup;

  moduleExists = true;
  moduleError = false;
  fileError = false;
  progress = false;
  uploadAttendanceProgress = true;
  success = false;

  uploadAttendanceError = '';
  attendanceError = '';

  maxDate = new Date();
  attendanceFile;
  file;

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
      date: [{value: '', disabled: true}, [Validators.required]],
      time: [{value: '', disabled: true}, [Validators.required]]
    });
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

  getLectureHoursOfModule() {
    this.uploadAttendanceProgress = false;
    this.data.getLectureHoursOfModule(this.uploadAttendanceForm.get('moduleCode').value).subscribe(
      response => {
        this.moduleName.setValue(response.moduleName);
        if (response.status && response.lectureHours.length !== 0) {
          this.lectureHour.enable();
          this.session.disable();
          this.sessions = [];
          this.lectureHours = response.lectureHours;
          this.elementRef.nativeElement.querySelector('#lectureHours').focus();
          this.moduleError = false;
        } else {
          this.moduleCode.setErrors({incorrect: false});
          this.lectureHour.disable();
          this.session.disable();
          if (response.lectureHours.length === 0) {
            this.moduleError = true;
          } else {
            this.moduleName.setValue('');
            this.moduleExists = false;
          }
        }
      }, error => {
        this.success = !error;
        this.uploadAttendanceError = error;
      }
    ).add(() => {
      this.attendanceFile = '';
      this.uploadAttendanceProgress = true;
    });
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
        this.success = !error;
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
      this.date.reset();
      this.time.reset();
    } else {
      this.date.disable();
      this.time.disable();
    }
  }

  onFileChange(ev) {
    this.uploadAttendanceProgress = false;
    this.attendanceFile = '';
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    this.file = ev.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, {type: 'binary'});
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      this.attendanceFile = jsonData.Sheet1;
      let isValid = true;
      if (this.attendanceFile[0].hasOwnProperty('index') && this.attendanceFile[0].hasOwnProperty('status')) {
        for (const attendance of this.attendanceFile) {
          if (attendance.index.toString().match(/^[0-9]{6}[A-Za-z]$/) === null || attendance.status !== 0 && attendance.status !== 1) {
            isValid = false;
            break;
          }
        }
      } else {
        isValid = false;
      }
      if (isValid) {
        this.attendanceFile.sort((a, b) => a.index > b.index ? 1 : -1);
        this.elementRef.nativeElement.querySelector('#preview').style.border = '1px solid lightgray';
        this.elementRef.nativeElement.querySelector('#addFile').style.border = 'none';
      } else {
        this.attendanceFile = '';
        this.elementRef.nativeElement.querySelector('#preview').style.border = '2px solid red';
      }
      this.fileError = !isValid;
    };
    reader.readAsBinaryString(this.file);
    this.uploadAttendanceProgress = true;
  }

  uploadAttendance() {
    if (this.uploadAttendanceForm.valid) {
      if (this.attendanceFile) {
        this.uploadAttendanceProgress = false;
        const data = {
          moduleCode: this.moduleCode.value,
          lectureHourID: this.lectureHour.value,
          sessionID: parseInt(this.session.value, 10),
          date: this.date.value,
          time: this.time.value,
          attendance: this.attendanceFile
        };
        this.data.uploadAttendance(data).subscribe(
          response => {
            this.attendanceFile = '';
            this.uploadAttendanceError = '';
            this.success = true;
            this.uploadAttendanceForm.reset();
          },
          error => {
            this.success = false;
            this.uploadAttendanceError = error;
          }
        ).add(() => this.uploadAttendanceProgress = true);
      } else {
        this.elementRef.nativeElement.querySelector('#preview').style.border = '2px solid red';
        this.elementRef.nativeElement.querySelector('#addFile').style.border = '2px solid black';
      }
    } else {
      this.scrollToFirstInvalidControl();
    }
  }

  scrollToFirstInvalidControl() {
    const firstInvalidControl: HTMLElement = this.elementRef.nativeElement.querySelector('form .ng-invalid');
    firstInvalidControl.scrollIntoView({behavior: 'smooth'});
  }

  clearData() {
    this.attendanceFile = '';
    this.date.disable();
    this.time.disable();
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
