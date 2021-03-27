import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-view-payment-details',
  templateUrl: './view-payment-details.component.html',
  styleUrls: ['./view-payment-details.component.css']
})
export class ViewPaymentDetailsComponent implements OnInit {
  paymentDetailsForm: FormGroup;
  panelOpenState = false;
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
  }

  verifyForm(){

  }

}
