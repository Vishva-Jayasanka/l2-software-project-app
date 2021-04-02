import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../_services/authentication.service';
import {DataService} from '../../_services/data.service';
import {MatDialogRef} from '@angular/material/dialog';

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



// -----------------------------------------------------------------------------------------------------------------------------------------
// view registration details Component
// -----------------------------------------------------------------------------------------------------------------------------------------

@Component({
  selector: 'app-profile-details-dialog',
  templateUrl: './profile-details-dialog.component.html',
  styleUrls: ['./registration.component.css']
})

export class ProfileDetailsDialogComponent implements OnInit {

  progress = false;
  error;

  constructor(
    public dataService: DataService,
    public dialogRef: MatDialogRef<ProfileDetailsDialogComponent>,
  ) {
  }

  ngOnInit() {
  }

  onNoClick() {
    this.dialogRef.close(false);
  }
  deleteModule() {

  }

}

// -----------------------------------------------------------------------------------------------------------------------------------------
// confirm registration msg Component
// -----------------------------------------------------------------------------------------------------------------------------------------

@Component({
  selector: 'app-confirm-details-dialog',
  templateUrl: './confirm-details-dialog.component.html',
  styleUrls: ['./registration.component.css']
})

export class ConfirmDetailsDialogComponent implements OnInit {

  progress = false;
  error;
  private router: any;

  constructor(
    public dataService: DataService,
    public dialogRef: MatDialogRef<ConfirmDetailsDialogComponent>,
  ) {
  }

  ngOnInit() {
  }

}
