import {Component, Input, OnInit} from '@angular/core';
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
  error = '';
  profilePicture: string;

  @Input() studentID: string;

  constructor(
    public userData: UserDataService,
    private authentication: AuthenticationService
  ) {
  }

  ngOnInit(): void {
    this.progress = true;
    console.log(this.studentID);
    if (this.studentID) {
      this.userData.getStudentDetails(this.studentID).subscribe(
        response => {
          this.userDetails = response.details;
          this.userDetails.educationQualification = response.educationQualifications;
          this.profilePicture = `data:image/jpeg;base64,${response.profilePicture}`;
          console.log(response);
        },
        error => this.error = error
      ).add(() => this.progress = false);
    } else {
      this.userData.getUserDetails().subscribe(
        response => {
          this.userDetails = response.details;
          this.userDetails.educationQualification = response.educationQualifications;
          this.profilePicture = this.userData.profilePicture;
          console.log(this.profilePicture);
        },
        error => {
          this.error = error;
        }
      ).add(() => this.progress = false);
    }
  }

  get getRole(): string {
    return this.authentication.details.role;
  }

}
