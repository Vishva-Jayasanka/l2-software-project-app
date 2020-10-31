import {Component, OnInit} from '@angular/core';
import {UserDataService} from '../../_services/user-data.service';
import {AuthenticationService} from '../../_services/authentication.service';
import {COURSES} from '../registration/registration.component';

export interface User {
  username: string;
  fullName: string;
  course: string;
  dateOfBirth: Date;
  email: string;
  address: string;
  mobile: string;
  home: string;
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
  userDetail: User;

  constructor(
    private authentication: AuthenticationService,
    public userData: UserDataService
  ) {
  }

  ngOnInit(): void {
    this.progress = true;
    this.userData.getUserDetails().subscribe(
      response => {
        const personal = response.details[0][0];
        const edu = response.details[1];
        this.userDetail = {
          username: this.authentication.details.username,
          fullName: personal.fullName,
          course: COURSES.find(course => course.courseID === personal.courseID).courseName,
          dateOfBirth: new Date(personal.dateOfBirth),
          email: personal.email,
          address: personal.address,
          mobile: personal.mobile,
          home: personal.home,
          educationQualification: []
        };
        for (const qualification of edu) {
          this.userDetail.educationQualification.push(qualification);
        }
        console.log(this.userDetail);
      },
      error => console.log(error)
    ).add(() => this.progress = false);
  }

}
