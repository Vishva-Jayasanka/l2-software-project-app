import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EMPTY, Subject, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {DataService} from '../../../_services/data.service';

export interface Request {
  requestTypeID: number;
  requestType: string;
}

@Component({
  selector: 'app-add-request',
  templateUrl: './add-request.component.html',
  styleUrls: ['./add-request.component.css', '../request.component.css']
})
export class AddRequestComponent implements OnInit {

  addRequestProgress = false;
  studentDoesNotExist = false;
  success = false;

  maxDate = new Date();

  requests: Request[] = [
    {requestTypeID: 1, requestType: 'Extension -Permitted Duration up to maximum duration'},
    {requestTypeID: 2, requestType: 'To sit examinations with next batch as first attempt candidate'},
    {requestTypeID: 3, requestType: 'Deferment'},
    {requestTypeID: 4, requestType: 'Deregistration from the program'},
    {requestTypeID: 5, requestType: 'Deregistration from course module(s)'},
    {requestTypeID: 6, requestType: 'Leave'},
    {requestTypeID: 7, requestType: 'Other(Please Specify)'}
  ];

  error = '';

  requestForm: FormGroup;
  term$ = new Subject<string>();
  private searchSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private data: DataService
  ) {
    this.searchSubscription = this.term$.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap(studentID => {
        this.error = '';
        this.success = false;
        this.studentDoesNotExist = false;
        this.checkStudentID(studentID);
        return EMPTY;
      })
    ).subscribe();
  }

  ngOnInit(): void {
    this.requestForm = this.formBuilder.group({
      studentID: ['', [Validators.required, Validators.pattern(/^[0-9]{6}[A-Z]$/)]],
      studentName: [''],
      course: [''],
      requestDate: ['', [Validators.required]],
      request: ['', Validators.required],
      reasons: this.formBuilder.array([this.formBuilder.group({
        reason: ['', Validators.required]
      })]),
      remarks: ['', [Validators.required]],
      recordBookAttached: [false],
      documentsAttached: [false]
    });
  }

  checkStudentID(studentID: string) {
    this.success = false;
    this.error = '';
    this.studentDoesNotExist = false;
    if (studentID) {
      this.data.checkStudentID(studentID).subscribe(
        response => {
          if (response.status) {
            this.studentName.setValue(response.name);
            this.course.setValue(response.course);
          } else {
            this.studentName.reset();
            this.course.reset();
            this.studentDoesNotExist = true;
          }
        },
        error => {
          this.error = error;
        }
      ).add(() => this.addRequestProgress = false);
    } else {
      this.addRequestProgress = false;
    }
  }

  submitForm() {
  }

  addReason() {
    this.reasons.push(this.formBuilder.group({
      reason: ['', [Validators.required]]
    }));
  }

  removeReason(i: number): void {
    this.reasons.controls.splice(i, i + 1);
  }

  toggleProgress() {
    this.addRequestProgress = true;
  }

  get studentID() {
    return this.requestForm.get('studentID');
  }

  get studentName() {
    return this.requestForm.get('studentName');
  }

  get course() {
    return this.requestForm.get('course');
  }

  get requestDate() {
    return this.requestForm.get('requestDate');
  }

  get request() {
    return this.requestForm.get('request');
  }

  get reasons(): FormArray {
    return this.requestForm.get('reasons') as FormArray;
  }

}
