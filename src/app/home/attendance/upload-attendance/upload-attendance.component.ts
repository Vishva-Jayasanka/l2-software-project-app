import {Component, ElementRef, OnInit} from '@angular/core';
import {LectureHour} from '../../results/results.component';
import {Session} from '../attendance.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {DataService} from '../../../_services/data.service';
import {AuthenticationService} from '../../../_services/authentication.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-upload-attendance',
  templateUrl: './upload-attendance.component.html',
  styleUrls: ['./upload-attendance.component.css']
})
export class UploadAttendanceComponent implements OnInit {

  lectureHours: LectureHour[] = [];
  sessions: Session[] = [];

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
    private elementRef: ElementRef
  ) { }

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
  }
  getLectureHoursOfModule() {
    this.uploadAttendanceProgress = false;
    this.success = false;
    this.moduleName.setValue('');
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
          this.date.disable();
          this.time.disable();
          this.moduleExists = response.lectureHours !== undefined;
          if (this.moduleExists && response.lectureHours.length === 0) {
            this.moduleError = true;
          }
        }
      }, error => {
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
    this.elementRef.nativeElement.querySelector('#fileUpload').value = '';
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
            this.uploadAttendanceForm.reset();
            this.success = true;
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
    this.uploadAttendanceForm.reset();
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

