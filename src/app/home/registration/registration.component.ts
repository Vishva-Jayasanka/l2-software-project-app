import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../_services/authentication.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

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
