import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {PasswordValidator} from '../../_services/shared.service';
import {AuthenticationService} from '../../_services/authentication.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  error = '';
  progress = false;
  successful = false;

  token: string;
  passwordResetForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private authentication: AuthenticationService
  ) {

    this.passwordResetForm = this.formBuilder.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    }, {validator: PasswordValidator});

    this.confirmPassword.valueChanges.subscribe(value => {
      if (this.password.touched && this.password.value !== this.confirmPassword.value) {
        this.confirmPassword.setErrors({incorrect: true});
      } else {
        this.confirmPassword.setErrors(null);
      }
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.token = params.token;
    });
  }

  resetPassword(): void {
    this.progress = true;
    const data = {
      password: this.password.value,
      token: this.token
    };
    console.log(data);
    this.authentication.resetPassword(data).subscribe(
      response => this.successful = true,
      error => this.error = error
    ).add(() => this.progress = false);
  }

  get password(): AbstractControl {
    return this.passwordResetForm.get('password');
  }

  get confirmPassword(): AbstractControl {
    return this.passwordResetForm.get('confirmPassword');
  }

}
