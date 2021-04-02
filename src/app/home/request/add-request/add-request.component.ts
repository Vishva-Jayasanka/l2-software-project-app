import {Component, ElementRef, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {EMPTY, Subject, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {DataService} from '../../../_services/data.service';
import {scrollToFirstInvalidElement} from '../../../_services/shared.service';

export interface RequestType {
  requestTypeID: number;
  request: string;
}

@Component({
  selector: 'app-add-request',
  templateUrl: './add-request.component.html',
  styleUrls: ['./add-request.component.css', '../request.component.css']
})
export class AddRequestComponent implements OnInit {

  uploadRequestProgress = false;
  studentIDNotFound = false;
  success = false;

  error = '';

  requestForm: FormGroup;
  maxDate: Date = new Date();
  term$ = new Subject<string>();
  private searchSubscription: Subscription;

  requestTypes: RequestType[];

  constructor(
    private formBuilder: FormBuilder,
    private data: DataService,
    private elementRef: ElementRef
  ) {
    this.searchSubscription = this.term$.pipe(
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
  }

  ngOnInit(): void {

    this.data.getRequestTypes().subscribe(
      response => {
        this.requestTypes = response.requestTypes;
        console.log(this.requestTypes);
      },
      error => this.error = error
    );

    this.requestForm = this.formBuilder.group({
      studentID: ['', [Validators.required, Validators.pattern(/^[0-9]{6}[A-Za-z]/)]],
      studentName: ['', [Validators.required]],
      course: ['', [Validators.required]],
      submissionDate: ['', [Validators.required]],
      request: ['', [Validators.required]],
      reasons: this.formBuilder.array([new FormControl('', [Validators.required])]),
      remarks: ['', [Validators.required]],
      recordBookAttached: [false],
      documentsAttached: [false]
    });
  }

  checkStudentID(studentID: string): void {
    this.success = false;
    this.error = '';
    this.studentIDNotFound = false;
    if (studentID) {
      this.data.checkStudentID(studentID).subscribe(
        response => {
          if (response.status) {
            this.studentName.setValue(response.name);
            this.course.setValue(response.course);
          } else {
            this.studentName.reset();
            this.course.reset();
            this.studentIDNotFound = true;
          }
        },
        error => {
          this.error = error;
        }
      ).add(() => this.uploadRequestProgress = false);
    } else {
      this.uploadRequestProgress = false;
    }
  }

  submitForm(): void {
    this.error = '';
    this.success = false;
    this.uploadRequestProgress = true;
    if (this.requestForm.valid) {
      if (confirm('Are you sure you want to submit this form?')) {
        this.uploadRequestProgress = true;
        this.data.uploadRequest(this.requestForm.value).subscribe(
          response => {
            this.success = true;
            this.reasons.controls = [new FormControl('', [Validators.required])];
            this.requestForm.reset();
          },
          error => {
            this.error = error;
          }
        ).add(() => this.uploadRequestProgress = false);
      }
    } else {
      this.uploadRequestProgress = false;
      scrollToFirstInvalidElement(this.elementRef);
    }
  }

  toggleProgress(): void {
    this.uploadRequestProgress = true;
  }

  addReason(): void {
    this.reasons.push(new FormControl('', [Validators.required]));
  }

  removeReason(i: number): void {
    this.reasons.controls.splice(i, i + 1);
  }

  get studentID(): AbstractControl {
    return this.requestForm.get('studentID');
  }

  get studentName(): AbstractControl {
    return this.requestForm.get('studentName');
  }

  get course(): AbstractControl {
    return this.requestForm.get('course');
  }

  get submissionDate(): AbstractControl {
    return this.requestForm.get('submissionDate');
  }

  get request(): AbstractControl {
    return this.requestForm.get('request');
  }

  get recordBookAttached(): AbstractControl {
    return this.requestForm.get('recordBookAttached');
  }

  get documentsAttached(): AbstractControl {
    return this.requestForm.get('documentsAttached');
  }

  get reasons(): FormArray {
    return this.requestForm.get('reasons') as FormArray;
  }

}
