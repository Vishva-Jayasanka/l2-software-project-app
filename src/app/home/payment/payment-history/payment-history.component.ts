import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../../../_services/authentication.service';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css']
})
export class PaymentHistoryComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authentication: AuthenticationService
  ) { }

  ngOnInit(): void {
    if (this.getRole === 'Admin') {
      this.router.navigate(['../view-payments-home'], {relativeTo: this.route});
    }
  }

  get getRole(): string {
    return this.authentication.details.role;
  }

}
