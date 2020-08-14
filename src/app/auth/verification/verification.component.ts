import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../_services/authentication.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent implements OnInit {

  emailForm: FormGroup;
  verificationCodeForm: FormGroup;
  error = '';
  progress = false;

  constructor(
    private formBuilder: FormBuilder,
    private authentication: AuthenticationService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.authentication.isVerified().subscribe(
      response => {
        if (response.verified) {
          this.router.navigate(['/']);
        }
      },
      error => {
        console.log(error);
      }
    );
    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]]
    });
    this.verificationCodeForm = this.formBuilder.group({
      verificationCode: ['', [Validators.minLength(6), Validators.required]]
    });
  }

  onSubmitEmail() {
    this.authentication.sendVerificationEmail(this.emailForm.value).subscribe(
      response => console.log(response),
      error => console.log(error)
    );
  }

  onSubmitOTP() {
    this.progress = true;
    this.authentication.verifyEmail(this.verificationCodeForm.value).subscribe(
      response => {
        this.router.navigate(['/']);
      },
      error => {
        this.error = error;
      }
    ).add(
      () => this.progress = false
    );
  }

  get email() {
    return this.emailForm.get('email');
  }

  get OTP() {
    return this.verificationCodeForm.get('verificationCode');
  }

}
