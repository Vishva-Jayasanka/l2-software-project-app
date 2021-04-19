import { formatDate } from '@angular/common';
import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup,FormsModule, Validators} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {DataService} from '../../../../_services/data.service';
import { ConfirmUpdateDialogComponent, ConfirmDeleteDialogComponent } from '../view-paymentsHome.component';

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
  panelOpenState = false;
  selectedRowIndex = -1;
  success = false;
  error = '';
  dataSource;
  date1
  paymentDate: FormControl;


  banks: Bank[] = [
    {bankID: 0, bankName: 'BOC'},
    {bankID: 1, bankName: 'Peoples Bank'}
  ];

  public options2 = [
    {"id": 1, "name": "a"},
    {"id": 2, "name": "b"}
  ]
  public selectedBank;


  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private datePipe: DatePipe,
    private elementRef: ElementRef,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.resetForm();
    this.paymentDetailsForm = this.formBuilder.group({
      paymentDetailsdepositor: this.formBuilder.group({
        registrationNumber: [''],
        fullName: [''],
        courseId: [''],
        academicYear: [''],
        bankName: [''],
        slipNumber: [''],
        amountPaid: [''],
        paymentDate: ['', [Validators.required, Validators.pattern('dd-MM-yyyy')]]
      })
    }
  );
    this.getData();
  }

  getData(): void {
    console.log('data from edit=', this.data);
    console.log('data.slip no =', this.data.slipNo);
    
    this.error = '';
    this.success = false;
    this.dataService.getStudentPaymentDetails(this.data.slipNo).subscribe(
        response => {
          if (response.status) {
            this.dataSource = response.results[0][0];

            this.registrationNumber.setValue(this.dataSource.studentID);
            this.fullName.setValue(this.data.fullName);
            this.courseId.setValue(this.dataSource.fullName);
            this.academicYear.setValue(this.dataSource.academicYear);

            // this.bankName.setValue(this.dataSource.bank);
            this.slipNumber.setValue(this.dataSource.slipNo);
            this.amountPaid.setValue(this.dataSource.amount);
            // this.paymentDate.setValue(new FormControl(new Date(this.datePipe.transform(new Date(this.dataSource.paymentDate),"dd/MM/yyyy"))));
            this.paymentDate = new FormControl(new Date(this.datePipe.transform(new Date(this.dataSource.paymentDate),"dd/MM/yyyy")));
            this.banks.forEach((value) => {
              if (this.dataSource.bank.toString().trim() === value.bankName) {
                this.selectedBank = value.bankID;
              }
            });

          }
        },
        error => this.error = error
      );
    }

 submitForm() {
    console.log(this.paymentDetailsForm);
    // if (this.paymentDetailsForm.valid) {
      this.paymentDetailsForm.value.paymentDetailsdepositor.bankName = this.banks[this.selectedBank].bankName;
      this.paymentDetailsForm.value.paymentDetailsdepositor.paymentDate = this.paymentDate.value;
      this.dataService.editPayment(this.paymentDetailsForm.value.paymentDetailsdepositor).subscribe(
       response => {
        console.log(response);
         if (response.status){
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
  //  }
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
    // this.deleteSelectedPayment.emit(true);
  }

  resetForm() {
    this.dataSource = null;
    this.paymentDate = null;
    // this.paymentDetailsForm.reset();
    // this.elementRef.nativeElement.querySelector('#confirm-button').scrollIntoView();
  }
  get slipNumber() {
    return this.paymentDetailsForm.get('paymentDetailsdepositor').get('slipNumber');
  }

  get fullName(): AbstractControl  {
    return this.paymentDetailsForm.get('paymentDetailsdepositor').get('fullName');
  }

  get registrationNumber(): AbstractControl  {
    return this.paymentDetailsForm.get('paymentDetailsdepositor').get('registrationNumber');
  }

  get courseId(): AbstractControl  {
    return this.paymentDetailsForm.get('paymentDetailsdepositor').get('courseId');
  }

  get academicYear(): AbstractControl  {
    return this.paymentDetailsForm.get('paymentDetailsdepositor').get('academicYear');
  }

  get bankName(): AbstractControl  {
    return this.paymentDetailsForm.get('paymentDetailsdepositor').get('bankName');
  }

  get amountPaid(): AbstractControl  {
    return this.paymentDetailsForm.get('paymentDetailsdepositor').get('amountPaid');
  }

  // get paymentDate(): AbstractControl  {
  //   return this.paymentDetailsForm.get('paymentDetailsdepositor').get('paymentDate');
  // }


  openConfirmUpdateDialog(){
    const dialogRef = this.dialog.open(ConfirmUpdateDialogComponent, {
      width: '450px',

      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
      }
    });
  }

  openConfirmDeleteDialog(){
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
