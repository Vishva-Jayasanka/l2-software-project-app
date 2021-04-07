import { Component, Input, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DataService} from '../../../../_services/data.service';

@Component({
  selector: 'app-view-payment-details',
  templateUrl: './view-payment-details.component.html',
  styleUrls: ['./view-payment-details.component.css']
})
export class ViewPaymentDetailsComponent implements OnInit {
  @Input() data: any;
  @Input() position: number;
  paymentDetailsForm: FormGroup;
  panelOpenState = false;
  selectedRowIndex = -1;
  success = false;
  error = '';
  dataSource;


  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
  ) { }

  ngOnInit(): void {
    this.paymentDetailsForm = this.formBuilder.group({
      depositor: this.formBuilder.group({
        fullName: [''],
        courseId: [''],
      }),
      deposit: this.formBuilder.group({
        bankName: [''],
        slipNumber: [''],
        totalPaid: [''],
        paymentDate: [''],
      }),
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
            console.log('this.dataSource=',this.dataSource);

            this.registrationNumber.setValue(this.dataSource.fullName);
            this.fullName.setValue(this.data.fullName);
            this.courseId.setValue(this.dataSource.fullName);
            this.academicYear.setValue(this.dataSource.fullName);

            this.bankName.setValue(this.dataSource.bank);
            this.slipNumber.setValue(this.dataSource.slipNo);
            this.amountPaid.setValue(this.dataSource.amount);
            this.paymentDate.setValue(this.dataSource.paymentDate);
          }
        },
        error => this.error = error
      );
    }
  get slipNumber() {
    return this.paymentDetailsForm.get('slipNumber');
  }

  get fullName() {
    return this.paymentDetailsForm.get('fullName');
  }

  get registrationNumber() {
    return this.paymentDetailsForm.get('registrationNumber');
  }

  get courseId() {
    return this.paymentDetailsForm.get('courseId');
  }

  get academicYear() {
    return this.paymentDetailsForm.get('academicYear');
  }

  get bankName() {
    return this.paymentDetailsForm.get('bankName');
  }

  get amountPaid() {
    return this.paymentDetailsForm.get('amountPaid');
  }

  get paymentDate() {
    return this.paymentDetailsForm.get('paymentDate');
  }

}
