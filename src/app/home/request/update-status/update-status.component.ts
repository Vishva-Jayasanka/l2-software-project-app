import {Component, ElementRef, OnInit} from '@angular/core';
import {AbstractControl, Form, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {EMPTY, Subject, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {DataService} from '../../../_services/data.service';
import {RequestType} from '../add-request/add-request.component';
import {scrollToFirstInvalidElement} from '../../../_services/shared.service';

export interface Request {
  requestID: number;
  date: Date;
  remarks: string;
  requestTypes: {
    requestTypeID: number;
    request: string;
  }[];
  reviewedBy: {
    reviewedBy: number;
    status: number;
    reason: string;
  }[];
  reasons: {
    reasonID: number;
    reason: string;
  }[];
  finalDecision: number;
}

export interface Reviewer {
  reviewerID: number;
  reviewer: string;
}

@Component({
  selector: 'app-update-status',
  templateUrl: './update-status.component.html',
  styleUrls: ['./update-status.component.css', '../request.component.css']
})
export class UpdateStatusComponent implements OnInit {

  updateRequestProgress = false;
  success = false;
  studentIDNotFound = false;

  error = '';

  updateRequestForm: FormGroup;
  term$ = new Subject<string>();
  private searchSubscription: Subscription;
  currentRequestID: number;
  requests: Request[];
  reviewers: Reviewer[];
  requestTypes: RequestType[];
  maxDate = Date.now();

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

    this.updateRequestForm = this.formBuilder.group({
      studentID: ['', [Validators.required, Validators.pattern(/^[0-9]{6}[A-Z]/)]],
      studentName: [''],
      request: ['', [Validators.required]],
      requests: ['', [Validators.required]],
      submissionDate: ['', [Validators.required]],
      remarks: ['', [Validators.required]],
      recordBookAttached: [false],
      relevantDocumentsAttached: [false],
      reasons: this.formBuilder.array([new FormControl('', [Validators.required])]),
      progress: this.formBuilder.array([this.addStep('', '', '')]),
      finalDecision: ['2', [Validators.required]]
    });

  }

  addStep(status: number | '', by: number | '', reason: string | ''): FormGroup {
    return this.formBuilder.group({
      status: [status, [Validators.required]],
      by: [by],
      reason: [reason]
    });
  }

  removeStep(index: number): void {
    this.progress.removeAt(index);
  }

  addReason(value: string): AbstractControl {
    return new FormControl(value, [Validators.required]);
  }

  removeReason(i: number): void {
    this.reasons.controls.splice(i, i + 1);
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
            this.data.getRequestsBrief(this.studentID.value).subscribe(
              response1 => {
                this.requests = response1.requests;
                for (const request of this.requests) {
                  request.requestTypes = response1.requestTypes.filter(requestType => requestType.requestID === request.requestID).map(
                    requestsMade => {
                      return {
                        requestTypeID: requestsMade.requestTypeID,
                        request: requestsMade.request
                      };
                    }
                  )
                  ;
                }
                if (this.requests.length === 0) {
                  this.error = 'No request have been made by this student';
                } else {
                  this.elementRef.nativeElement.querySelector('#requests').focus();
                }
              },
              error => this.error = error
            );
          } else {
            this.studentName.reset();
            this.studentIDNotFound = true;
          }
        },
        error => {
          this.error = error;
        }
      ).add(() => this.updateRequestProgress = false);
    } else {
      this.updateRequestProgress = false;
    }
  }

  getRequestDetails(value: string): void {
    this.updateRequestProgress = true;
    this.error = '';
    this.success = false;
    const requestID = parseInt(value, 10);
    this.data.getRequestDetails(requestID).subscribe(
      response => {
        this.currentRequestID = requestID;
        this.reviewers = response.reviewers;
        this.submissionDate.setValue(response.request[0].date);
        this.remarks.setValue(response.request[0].remarks);
        this.recordBookAttached.setValue(response.request[0].recordBookAttached);
        this.relevantDocumentsAttached.setValue(response.request[0].relevantDocumentsAttached);
        this.finalDecision.setValue(response.request[0].finalDecision.toString());
        const temp = this.requests.find(request => request.requestID === requestID);
        temp.reasons = response.reasons;
        this.selectedRequestTypes.setValue(temp.requestTypes.map(type => type.requestTypeID));
        this.reasons.controls = [];
        for (const reason of temp.reasons) {
          this.reasons.insert(0, this.addReason(reason.reason));
        }
        temp.reviewedBy = response.reviewedBy;
        this.progress.controls = [];
        for (const reviewer of temp.reviewedBy) {
          this.progress.push(this.addStep(reviewer.status, reviewer.reviewedBy, reviewer.reason));
        }
      },
      error => this.error = error
    ).add(() => this.updateRequestProgress = false);
  }

  submitForm(): void {
    this.updateRequestProgress = true;
    this.success = false;
    this.error = '';
    if (this.updateRequestForm.valid) {
      this.data.updateRequestStatus({
        requestID: this.currentRequestID,
        newData: this.updateRequestForm.value
      }).subscribe(
        response => {
          this.success = true;
          this.updateRequestForm.reset();
        },
        error => this.error = error
      ).add(() => this.updateRequestProgress = false);
    } else {
      this.updateRequestProgress = false;
      scrollToFirstInvalidElement(this.elementRef);
    }

  }

  toggleProgress(): void {
    this.updateRequestProgress = true;
  }

  get studentID() {
    return this.updateRequestForm.get('studentID');
  }

  get studentName(): AbstractControl {
    return this.updateRequestForm.get('studentName');
  }

  get selectedRequest(): AbstractControl {
    return this.updateRequestForm.get('request');
  }

  get selectedRequestTypes(): AbstractControl {
    return this.updateRequestForm.get('requests');
  }

  get submissionDate(): AbstractControl {
    return this.updateRequestForm.get('submissionDate');
  }

  get remarks(): AbstractControl {
    return this.updateRequestForm.get('remarks');
  }

  get recordBookAttached(): AbstractControl {
    return this.updateRequestForm.get('recordBookAttached');
  }

  get relevantDocumentsAttached(): AbstractControl {
    return this.updateRequestForm.get('relevantDocumentsAttached');
  }

  get reasons(): FormArray {
    return this.updateRequestForm.get('reasons') as FormArray;
  }

  get progress(): FormArray {
    return this.updateRequestForm.get('progress') as FormArray;
  }

  get finalDecision(): AbstractControl {
    return this.updateRequestForm.get('finalDecision');
  }

}
