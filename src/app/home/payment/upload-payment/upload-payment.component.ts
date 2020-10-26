import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DataService} from '../../../_services/data.service';

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

  banks: Bank[] = [
    {bankID: 1, bankName: 'BOC'},
  ];

  paymentForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private data: DataService
  ) {
  }

  ngOnInit(): void {

    this.paymentForm = this.formBuilder.group({
        depositor: this.formBuilder.group({
        registrationNumber: ['', [Validators.required, Validators.pattern(/^([0-9]{6}[A-Za-z])$/)]],
        fullName: ['', [Validators.required]],
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
    this.data.paymentUpload(this.paymentForm.value).subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.error(error);
      }
    );
  }
    get fullName(){
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
