import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../_services/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  progress = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private authentication: AuthenticationService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern(/^[0-9]{6}[A-Za-z]$/)]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    this.progress = true;
    this.authentication.login(this.loginForm.value).subscribe(
      response => {
        if (response.verified) {
          this.router.navigate(['/']);
        } else {
          this.router.navigate(['/auth/verification']);
        }
      },
      error => {
        this.error = error;
      }
    ).add(
      () => this.progress = false
    );
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

}
