import {Component, OnInit} from '@angular/core';
import {UserDataService} from '../../_services/user-data.service';
import {AuthenticationService} from '../../_services/authentication.service';

export interface User {
  username: string;
  roleName: string;
  firstName: string;
  lastName: string;
  fullName: string;
  courseName: string;
  dateOfBirth: Date;
  email: string;
  recoveryEmail: string;
  address: string;
  mobile: string;
  home: string;
  academicYear: number;
  currentGPA: number | string;
  company: string;
  designation: string;
  nic: string;
  educationQualification: {
    degree: string;
    institute: string;
    dateCompleted: Date;
    class: string
  }[];
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  progress = false;
  userDetails: User;

  constructor(
    public userData: UserDataService,
    private authentication: AuthenticationService
  ) {
  }

  ngOnInit(): void {
    this.progress = true;
    this.userData.getUserDetails().subscribe(
      response => {
        console.log(response.details);
        console.log(response.educationQualifications);
        this.userDetails = response.details;
        this.userDetails.educationQualification = response.educationQualifications;
      },
      error => {
        console.log(error);
      }
    ).add(() => this.progress = false);
  }

  get getRole(): string {
    return this.authentication.details.role;
  }

}
