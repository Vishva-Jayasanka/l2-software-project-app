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
    console.log('data.slip no =', this.data.slipNo);
    this.error = '';
    this.success = false;
    this.data.getStudentPaymentDetails({
        slipNo: this.slipNumber[this.slipNumber.value].value
      }
      ).subscribe(
        response => {
          if (response.status) {
            this.dataSource = response.results[0];
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

  get courseId() {
    return this.paymentDetailsForm.get('courseId');
  }

  get bankName() {
    return this.paymentDetailsForm.get('bankName');
  }

  get totalPaid() {
    return this.paymentDetailsForm.get('totalPaid');
  }

  get paymentDate() {
    return this.paymentDetailsForm.get('paymentDate');
  }

}
