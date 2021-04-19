import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EMPTY, Subject, Subscription} from 'rxjs';
import {DataService} from '../../../_services/data.service';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {Bank} from '../upload-payment/upload-payment.component';
import { AuthenticationService } from 'src/app/_services/authentication.service';


@Component({
  selector: 'app-edit-payment',
  templateUrl: './edit-payment.component.html',
  styleUrls: ['./edit-payment.component.css']
})
export class EditPaymentComponent implements OnInit {
  dataSource;
  editPaymentProgress = false;
  hidePaymentDetails = false;
  panelOpenState = false;
  success = false;
  error = '';

  banks: Bank[] = [
    {bankID: 1, bankName: 'BOC'},
    {bankID: 2, bankName: 'Peoples Bank'}
  ];

  paymentForm: FormGroup;
  term$ = new Subject<string>();
  private searchSubscription: Subscription;
  private elementRef: ElementRef;
  buttonProgress: false;
  authentication: AuthenticationService;



  constructor(
    private formBuilder: FormBuilder,
    private data: DataService,
  ) {

    this.searchSubscription = this.term$.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap(studentID => {
        this.error = '';
        this.success = false;
        this.hidePaymentDetails = false;
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

  getData(studentId: string){
    if (studentId) {
    this.data.getStudentPaymentList(studentId).subscribe(
      response => {
        if (response.status) {
          this.dataSource='';
          this.dataSource = response.results[0];
        } else {
          this.hidePaymentDetails = true;
        }
      },
      error => this.error = error
    ).add(() => this.editPaymentProgress = false);
  }
    this.editPaymentProgress = false;
  }

  // submitForm() {
  //   this.data.uploadPayment(this.paymentForm.value).subscribe(
  //     response => {
  //       console.log(response);
  //     },
  //     error => {
  //       this.error = error;
  //     }
  //   );
  // }


  checkStudentID(studentID) {
    this.success = false;
    this.error = '';
    this.hidePaymentDetails = false;
    if (studentID) {
      this.data.checkStudentID(studentID).subscribe(
        response => {
          if (response.status) {
            this.fullName.setValue(response.name);
            this.getData(response.studentID);
            this.hidePaymentDetails = false;
          } else {
            this.hidePaymentDetails = true;
          }
        },
        error => this.error = error
      ).add(() => this.editPaymentProgress = false);
    }
    this.editPaymentProgress = false;
  }

  toggleProgress() {
    this.editPaymentProgress = true;
  }

  get fullName() {
    return this.paymentForm.get('depositor').get('fullName');
  }

  get registrationNumber() {
    return this.paymentForm.get('depositor').get('registrationNumber');
  }

  resetForm() {
    this.paymentForm.reset();
    this.editPaymentProgress = false;
    this.elementRef.nativeElement.querySelector('#course-name').scrollIntoView();
    this.ngOnInit();
  }

  deleteSelectedPayment(value: any) {
    console.log('value  =', value);
    this.hidePaymentDetails = value;
    // this.resetForm();
    this.ngOnInit();
  }
}
