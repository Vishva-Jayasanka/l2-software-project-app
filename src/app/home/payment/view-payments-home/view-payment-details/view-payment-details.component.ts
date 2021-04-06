import { Component, Input, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

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

  getData(){
    console.log('data.slip no =', this.data.slipNo);
    // api call
  }
}
