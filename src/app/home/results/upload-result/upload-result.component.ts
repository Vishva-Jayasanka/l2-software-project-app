import {Component, ElementRef, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {EMPTY, Subject, Subscription} from 'rxjs';
import {DataService} from '../../../_services/data.service';
import * as XLSX from 'xlsx';

export interface Exam {
  examID: number;
  type: string;
  dateHeld: Date;
}

export interface Result {
  index: string;
  mark: number;
}

@Component({
  selector: 'app-upload-result',
  templateUrl: './upload-result.component.html',
  styleUrls: ['./upload-result.component.css', '../results.component.css']
})
export class UploadResultComponent implements OnInit {

  YEARS = [2016, 2017, 2018, 2019, 2020];
  exams: Exam[] = [];

  moduleName = '';
  error = '';
  resultsFile: Result[] = [];
  allocationAvailable;
  file;

  uploadResultsForm: FormGroup;
  term$ = new Subject<string>();
  private searchSubscription: Subscription;
  maxDate: Date = new Date();

  uploadResultsProgress = false;
  moduleExists = false;
  fileError = false;
  success = false;

  constructor(
    private formBuilder: FormBuilder,
    private data: DataService,
    private elementRef: ElementRef
  ) {
    this.searchSubscription = this.term$.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap(moduleCode => {
        this.checkModule(moduleCode);
        return EMPTY;
      })
    ).subscribe();
  }

  ngOnInit(): void {
    this.uploadResultsForm = this.formBuilder.group({
      moduleCode: ['', [Validators.required, Validators.pattern(/^[A-za-z]{2}[0-9]{4}/)]],
      batch: [{value: '', disabled: true}, [Validators.required]],
      exam: [{value: '', disabled: true}, [Validators.required]],
      type: [{value: '', disabled: true}, [Validators.required]],
      dateHeld: [{value: '', disabled: true}, [Validators.required]],
      allocation: [{value: '', disabled: true}, [Validators.required, Validators.pattern(/^[1-9]$|^[1-9][0-9]$|^(100)$/)]],
      hideMarks: [{value: false, disabled: true}]
    });
  }

  checkModule(moduleCode: string) {
    this.batch.disable();
    this.exam.disable();
    this.type.disable();
    this.dateHeld.disable();
    this.allocation.disable();
    this.hideMarks.disable();
    this.error = '';
    this.success = false;
    this.moduleExists = false;
    if (moduleCode !== '') {
      this.data.checkIfModuleExists(moduleCode).subscribe(
        response => {
          response.status ? this.moduleName = '' : this.moduleName = response.moduleName;
          this.moduleExists = response.status;
          if (this.moduleName) {
            this.batch.enable();
            this.batch.reset();
            this.elementRef.nativeElement.querySelector('#batch').focus();
          }
        },
        error => this.moduleName = ''
      ).add(() => this.uploadResultsProgress = false);
    } else {
      this.uploadResultsProgress = false;
    }
  }

  getExams(batch: number) {
    this.error = '';
    this.success = false;
    this.uploadResultsProgress = true;
    this.exam.disable();
    this.type.disable();
    this.dateHeld.disable();
    this.allocation.disable();
    this.hideMarks.disable();
    this.data.getExamsOfModule(this.moduleCode.value, batch).subscribe(
      response => {
        if (response.allocationAvailable > 0) {
          this.allocationAvailable = response.allocationAvailable;
          this.exams = response.exams;
          this.exam.reset();
          this.exam.enable();
          this.elementRef.nativeElement.querySelector('#exam').focus();
        } else {
          this.error = 'Cannot allocate marks for this module.';
        }
      },
      error => this.error = error
    ).add(() => this.uploadResultsProgress = false);
  }

  checkValue() {
    if (parseInt(this.exam.value, 10) !== 0) {
      this.type.disable();
      this.dateHeld.disable();
      this.allocation.disable();
      this.hideMarks.disable();
    } else {
      this.type.enable();
      this.dateHeld.enable();
      this.allocation.enable();
      this.hideMarks.enable();
    }
  }

  onFileChange(ev) {
    this.uploadResultsProgress = true;
    this.resultsFile = [];
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
      this.resultsFile = jsonData.Sheet1;
      let isValid = true;
      if (this.resultsFile[0].hasOwnProperty('index') && this.resultsFile[0].hasOwnProperty('mark')) {
        for (const attendance of this.resultsFile) {
          if (attendance.index.toString().match(/^[0-9]{6}[A-Za-z]$/) === null ||
            isNaN(attendance.mark) || attendance.mark < 0 || attendance.mark > 100) {
            isValid = false;
            break;
          }
        }
      } else {
        isValid = false;
      }
      if (isValid) {
        this.resultsFile.sort((a, b) => a.index > b.index ? 1 : -1);
        this.elementRef.nativeElement.querySelector('#preview').style.boxShadow = '0 0 0 2px rgb(100, 60, 180)';
        setTimeout(() => this.elementRef.nativeElement.querySelector('#preview').style.boxShadow = '0 0 0 2px white', 2000);
      } else {
        this.resultsFile = [];
        this.elementRef.nativeElement.querySelector('#preview').style.boxShadow = '0 0 0 2px red';
        setTimeout(() => this.elementRef.nativeElement.querySelector('#preview').style.boxShadow = '0 0 0 2px rgb(255, 200, 200)', 2000);
      }
      this.fileError = !isValid;
    };
    reader.readAsBinaryString(this.file);
    this.uploadResultsProgress = false;
    this.elementRef.nativeElement.querySelector('#resultFileUpload').value = '';
  }

  uploadResults() {
    this.success = false;
    this.error = '';
    this.uploadResultsProgress = true;
    if (confirm('Are you sure you want to save this file')) {
      if (this.uploadResultsForm.valid) {
        if (this.resultsFile.length !== 0) {
          const data = {
            moduleCode: this.moduleCode.value,
            batch: this.batch.value,
            examID: parseInt(this.exam.value, 10),
            type: this.type.value,
            dateHeld: this.dateHeld.value ? this.dateHeld.value : null,
            allocation: parseInt(this.allocation.value, 10),
            hideMarks: this.hideMarks.value,
            results: this.resultsFile
          };
          this.data.uploadExamResults(data).subscribe(
            response => {
              this.success = true;
              this.elementRef.nativeElement.querySelector('#preview').style.boxShadow = '0 0 0 2px rgb(100, 60, 180)';
              setTimeout(() => this.elementRef.nativeElement.querySelector('#preview').style.boxShadow = '0 0 0 2px white', 2000);
            },
            error => this.error = error
          ).add(() => this.uploadResultsProgress = false);
        } else {
          this.uploadResultsProgress = false;
          this.elementRef.nativeElement.querySelector('#preview').style.boxShadow = '0 0 0 2px red';
          setTimeout(() => this.elementRef.nativeElement.querySelector('#preview').style.boxShadow = '0 0 0 2px white', 2000);
          this.elementRef.nativeElement.querySelector('#messages').scrollIntoView({behavior: 'smooth'});
          this.elementRef.nativeElement.querySelector('#addFile').style.border = '2px solid black';
        }
      } else {
        this.scrollToFirstInvalidControl();
      }
    } else {
      this.uploadResultsProgress = false;
    }
  }

  resetForm() {
    this.resultsFile = [];
    this.moduleName = '';
    this.moduleExists = false;
    setTimeout(() => this.uploadResultsProgress = false, 1000);
  }

  scrollToFirstInvalidControl() {
    const firstInvalidControl: HTMLElement = this.elementRef.nativeElement.querySelector('form .ng-invalid');
    firstInvalidControl.scrollIntoView({behavior: 'smooth'});
  }

  openFile() {
    this.elementRef.nativeElement.querySelector('#resultFileUpload').click();
  }

  toggleProgress() {
    this.uploadResultsProgress = true;
  }

  get moduleCode() {
    return this.uploadResultsForm.get('moduleCode');
  }

  get batch() {
    return this.uploadResultsForm.get('batch');
  }

  get exam() {
    return this.uploadResultsForm.get('exam');
  }

  get type() {
    return this.uploadResultsForm.get('type');
  }

  get dateHeld() {
    return this.uploadResultsForm.get('dateHeld');
  }

  get allocation() {
    return this.uploadResultsForm.get('allocation');
  }

  get hideMarks() {
    return this.uploadResultsForm.get('hideMarks');
  }

}
