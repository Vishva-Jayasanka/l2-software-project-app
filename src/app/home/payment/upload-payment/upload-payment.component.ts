import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DataService} from '../../../_services/data.service';
import {EMPTY, Subject, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';

export interface Bank {
  bankID: number;
  bankName: string;
}

@Component({
  selector: 'app-upload-payment',
  templateUrl: './upload-payment.component.html',
  styleUrls: ['./upload-payment.component.css']
})
export class UploadPaymentComponent implements OnInit {

  uploadAPaymentProgress = false;
  studentIDNotFound = false;

  error = '';

  banks: Bank[] = [
    {bankID: 1, bankName: 'BOC'},
    {bankID: 2, bankName: 'Peoples Bank'}
  ];

  paymentForm: FormGroup;
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
        this.studentIDNotFound = false;
        this.checkStudentID(studentID);
        return EMPTY;
      })
    ).subscribe();
  }

  ngOnInit(): void {
    this.paymentForm = this.formBuilder.group({
        depositor: this.formBuilder.group({
          registrationNumber: ['', [Validators.required, Validators.pattern(/^([0-9]{6}[A-Za-z])$/)]],
          fullName: [''],
        }),
        deposit: this.formBuilder.group({
          bankName: ['', [Validators.required]],
          slipNumber: ['', [Validators.required]],
          totalPaid: ['', [Validators.required]],
          paymentDate: ['', [Validators.required]],
        }),
      }
    );
  }

  submitForm() {
    this.data.uploadPayment(this.paymentForm.value).subscribe(
      response => {
        console.log(response);
      },
      error => {
        this.error = error;
      }
    );
  }

  checkStudentID(studentID) {
    this.error = '';
    this.studentIDNotFound = false;
    if (studentID) {
      this.data.checkStudentID(studentID).subscribe(
        response => {
          if (response.status) {
            this.fullName.setValue(response.name);
          } else {
            this.studentIDNotFound = true;
          }
        },
        error => this.error = error
      ).add(() => this.uploadAPaymentProgress = false);
    } else {
      this.uploadAPaymentProgress = false;
    }
  }

  toggleProgress() {
    this.uploadAPaymentProgress = true;
  }

  get fullName() {
    return this.paymentForm.get('depositor').get('fullName');
  }

  get registrationNumber() {
    return this.paymentForm.get('depositor').get('registrationNumber');
  }

  get bankName() {
    return this.paymentForm.get('deposit').get('bankName');
  }

  get slipNumber() {
    return this.paymentForm.get('deposit').get('slipNumber');
  }

  get totalPaid() {
    return this.paymentForm.get('deposit').get('totalPaid');
  }

  get paymentDate() {
    return this.paymentForm.get('deposit').get('totalPaid');
  }
}
