import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Course} from "../../registration/registration.component";

@Component({
  selector: 'app-view-payment',
  templateUrl: './view-payment.component.html',
  styleUrls: ['./view-payment.component.css']
})
export class ViewPaymentComponent implements OnInit {
  paymentForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder
  )  { }

  ngOnInit(): void {
  }

}
