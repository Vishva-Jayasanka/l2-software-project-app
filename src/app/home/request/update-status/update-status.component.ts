import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EMPTY, Subject, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';

export interface Request {
  requestID: number;
  date: Date;
  requestTypes: {
    requestTypeID: number;
    requestType: string;
  }[];
  reasons: string[];
  status: number;
}

@Component({
  selector: 'app-update-status',
  templateUrl: './update-status.component.html',
  styleUrls: ['./update-status.component.css', '../request.component.css']
})
export class UpdateStatusComponent implements OnInit {

  updateRequestProgress = false;
  success = false;
  studentDoesNotExist = false;

  error = '';

  updateRequestForm: FormGroup;
  term$ = new Subject<string>();
  private searchSubscription: Subscription;
  requests: Request[] = [
    {
      requestID: 1,
      date: new Date('2020-05-02'),
      requestTypes: [{requestTypeID: 1, requestType: 'Deferment'}, {requestTypeID: 6, requestType: 'Leave'}],
      reasons: [],
      status: 0
    },
    {
      requestID: 1,
      date: new Date('2020-05-02'),
      requestTypes: [{requestTypeID: 7, requestType: 'Other'}, {requestTypeID: 5, requestType: 'Deregistration from course module(s)'}],
      reasons: [],
      status: 0
    },
    {
      requestID: 1,
      date: new Date('2020-05-02'),
      requestTypes: [{requestTypeID: 4, requestType: 'Deregistration from the program'}],
      reasons: [],
      status: 0
    },
  ];

  constructor(
    private formBuilder: FormBuilder
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
    this.updateRequestForm = this.formBuilder.group({
      studentID: ['', [Validators.required, Validators.pattern(/^[0-9]{6}[A-Z]/)]],
      studentName: [''],
      requests: ['', [Validators.required]]
    });
  }

  checkStudentID(studentID: string): void {
    this.updateRequestProgress = false;
  }

  toggleProgress(): void {
    this.updateRequestProgress = true;
  }

  get studentID() {
    return this.updateRequestForm.get('studentID');
  }

}
