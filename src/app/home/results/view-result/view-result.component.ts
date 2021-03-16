import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EMPTY, Subject, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {DataService} from '../../../_services/data.service';
import {Results} from '../../course-module/course-module.component';
import {YEARS} from '../../../_services/shared.service';

@Component({
  selector: 'app-view-result',
  templateUrl: './view-result.component.html',
  styleUrls: ['./view-result.component.css']
})
export class ViewResultComponent implements OnInit {

  years = YEARS;

  viewResultsProgress = false;
  success = false;
  studentIDNotFound = false;
  moduleCodeNotFound = false;

  error = '';

  viewResultsForm: FormGroup;
  results: Results[] = [
    {moduleName: 'Programming and Program Design', mark: 75, date: new Date('2020-01-01')},
    {moduleName: 'Distributed Systems and Networking', mark: 54, date: new Date('2020-01-05')},
    {moduleName: 'Object Oriented Programming', mark: 7, date: new Date('2020-04-08')}
  ];

  termModuleCode$ = new Subject<string>();
  private searchModuleCode: Subscription;

  termStudentID$ = new Subject<string>();
  private searchStudentID: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private data: DataService
  ) {

    this.searchModuleCode = this.termModuleCode$.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap(moduleCode => {
        this.error = '';
        this.success = false;
        this.moduleCodeNotFound = false;
        this.checkModuleCode(moduleCode);
        return EMPTY;
      })
    ).subscribe();

    this.searchStudentID = this.termStudentID$.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap(studentID => {
        this.error = '';
        this.success = false;
        this.studentIDNotFound = false;
        this.checkStudentID(studentID);
        return EMPTY;
      })
    ).subscribe();

    this.viewResultsForm = this.formBuilder.group({
      moduleCode: ['', [Validators.required, Validators.pattern(/^[A-Za-z]{2}[0-9]{4}$/)]],
      moduleName: ['', Validators.required],
      academicYear: ['', [Validators.required]],
      studentID: ['', [Validators.required, Validators.pattern(/^[0-9]{6}[A-Za-z]$/)]],
      studentName: ['', Validators.required]
    });

  }

  ngOnInit(): void {
  }

  checkModuleCode(moduleCode: string): void {
    this.error = '';
    this.success = false;
    this.academicYear.disable();
    this.studentID.disable();
    if (moduleCode) {
      this.data.checkIfModuleExists(moduleCode).subscribe(
        response => {
          if (!response.status) {
            this.moduleName.setValue(response.moduleName);
            this.academicYear.reset();
            this.academicYear.enable();
            this.studentID.reset();
            this.studentName.reset();
          } else {
            this.moduleCodeNotFound = true;
          }
        },
        error => {
          this.error = error;
        }
      ).add(() => this.viewResultsProgress = false);
    } else {
      this.viewResultsProgress = false;
    }
  }

  getExamResults(): void {
    this.viewResultsProgress = true;
    this.error = '';
    this.success = false;
    this.data.getResultsOfModule({
      moduleCode: this.moduleCode.value,
      academicYear: this.academicYear.value
    }).subscribe(
      response => {
        this.studentID.reset();
        this.studentID.enable();
      }, error => this.error = error
    );
  }

  checkStudentID(studentID: string): void {
    if (studentID) {
      this.data.checkStudentID(studentID).subscribe(
        response => {
          if (response.status) {
            this.studentName.setValue(response.name);
          } else {
            this.moduleCodeNotFound = true;
          }
        },
        error => {
          this.error = error;
        }
      ).add(() => this.viewResultsProgress = false);
    } else {
      this.viewResultsProgress = false;
    }
  }

  getResults() {
    this.data.getResults(this.viewResultsForm.value).subscribe(
      response => {
        console.log(response);
      }, error => {
        console.log(error);
      }
    );
  }

  toggleProgress(): void {
    this.viewResultsProgress = true;
  }

  get moduleCode(): AbstractControl {
    return this.viewResultsForm.get('moduleCode');
  }

  get moduleName(): AbstractControl {
    return this.viewResultsForm.get('moduleName');
  }

  get academicYear(): AbstractControl {
    return this.viewResultsForm.get('academicYear');
  }

  get studentID(): AbstractControl {
    return this.viewResultsForm.get('studentID');
  }

  get studentName(): AbstractControl {
    return this.viewResultsForm.get('studentName');
  }

}
