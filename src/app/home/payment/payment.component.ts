import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../_services/authentication.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  progress = false;

  constructor(
    private authentication: AuthenticationService
  ) {
  }

  ngOnInit(): void {
  }

  get getRole() {
    return this.authentication.details.role;
  }

}
