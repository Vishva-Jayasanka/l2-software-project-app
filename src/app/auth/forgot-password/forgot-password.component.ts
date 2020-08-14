import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../_services/authentication.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  usernameForm: FormGroup;
  error = '';
  progress = false;

  constructor(
    private router: Router,
    private authentication: AuthenticationService,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.usernameForm = this.formBuilder.group({
      username: ['', Validators.required]
    });
  }

  checkUsername() {
    this.progress = true;
    this.authentication.checkUsername(this.usernameForm.value).subscribe(
      response => {
        this.router.navigate(['/login']);
      },
      error => {
        this.error = error;
      },
    ).add(
      () => this.progress = false
    );
  }

  get username() {
    return this.usernameForm.get('username');
  }

}
