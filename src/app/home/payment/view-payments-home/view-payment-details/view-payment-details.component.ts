import {DatePipe} from '@angular/common';
import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {DataService} from '../../../../_services/data.service';
import {ConfirmUpdateDialogComponent, ConfirmDeleteDialogComponent} from '../view-payments-home.component';

export interface Bank {
  bankID: number;
  bankName: string;
}


@Component({
  selector: 'app-view-payment-details',
  templateUrl: './view-payment-details.component.html',
  styleUrls: ['./view-payment-details.component.css']
})
export class ViewPaymentDetailsComponent implements OnInit {

  @Input() data: any;
  @Input() position: number;
  @Output() deleteSelectedPayment = new EventEmitter<any>();

  paymentDetailsForm: FormGroup;
  success = false;
  error = '';
  dataSource;
  date1;
  maxDate = new Date();

  banks: Bank[] = [
    {bankID: 0, bankName: 'BOC'},
    {bankID: 1, bankName: 'Peoples Bank'}
  ];

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private datePipe: DatePipe,
    public dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    console.log(this.data);
    this.resetForm();
    this.paymentDetailsForm = this.formBuilder.group({
        paymentDetailsDepositor: this.formBuilder.group({
          registrationNumber: [''],
          fullName: [''],
          courseId: [''],
          academicYear: [''],
          bankName: [''],
          slipNumber: [''],
          amountPaid: [''],
          paymentDate: ['', [Validators.required]]
        })
      }
    );
    this.getData();
  }

  getData(): void {

    console.log(this.data);
    this.error = '';
    this.success = false;

    this.dataService.getStudentPaymentDetails(this.data.slipNo).subscribe(
      response => {
        if (response.status) {
          this.dataSource = response.results[0][0];
          this.registrationNumber.setValue(this.dataSource.studentID);
          this.fullName.setValue(this.data.fullName);
          this.courseId.setValue(this.dataSource.courseName);
          this.academicYear.setValue(this.dataSource.academicYear);
          this.slipNumber.setValue(this.dataSource.slipNo);
          this.amountPaid.setValue(this.dataSource.amount);
          this.bankName.setValue(this.banks.find(bank => bank.bankName.trim() === this.data.bank.trim()).bankID);
          this.paymentDate.setValue(this.data.paymentDate);
        }
      },
      error => this.error = error
    );

  }

  submitForm(): void {
    const data = this.paymentDetailsForm.value.paymentDetailsDepositor;
    console.log(data);
    data.bankName = this.banks.find(bank => bank.bankID === this.bankName.value).bankName;
    this.dataService.editPayment(data).subscribe(
      response => {
        if (response.status) {
          this.openConfirmUpdateDialog();
        }
        this.error = '';
        this.paymentDetailsForm.reset();
      },
      error => {
        this.success = false;
        this.error = error;
      }
    ).add();
  }

  deletePayment() {
    this.dataService.deletePayment({slipNo: this.slipNumber.value}).subscribe(
      response => {
        if (response.status) {
          this.openConfirmDeleteDialog();
        }
        this.error = '';
        this.paymentDetailsForm.reset();
      },
      error => {
        this.success = false;
        this.error = error;
      }
    ).add();
  }

  resetForm() {
    this.dataSource = null;
  }

  get slipNumber() {
    return this.paymentDetailsForm.get('paymentDetailsDepositor').get('slipNumber');
  }

  get fullName(): AbstractControl {
    return this.paymentDetailsForm.get('paymentDetailsDepositor').get('fullName');
  }

  get registrationNumber(): AbstractControl {
    return this.paymentDetailsForm.get('paymentDetailsDepositor').get('registrationNumber');
  }

  get courseId(): AbstractControl {
    return this.paymentDetailsForm.get('paymentDetailsDepositor').get('courseId');
  }

  get academicYear(): AbstractControl {
    return this.paymentDetailsForm.get('paymentDetailsDepositor').get('academicYear');
  }

  get bankName(): AbstractControl {
    return this.paymentDetailsForm.get('paymentDetailsDepositor').get('bankName');
  }

  get amountPaid(): AbstractControl {
    return this.paymentDetailsForm.get('paymentDetailsDepositor').get('amountPaid');
  }

  get paymentDate(): AbstractControl {
    return this.paymentDetailsForm.get('paymentDetailsDepositor').get('paymentDate');
  }

  openConfirmUpdateDialog() {
    const dialogRef = this.dialog.open(ConfirmUpdateDialogComponent, {
      width: '450px',

      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
      }
    });
  }

  openConfirmDeleteDialog() {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '450px',

      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
      }
    });
  }
}
