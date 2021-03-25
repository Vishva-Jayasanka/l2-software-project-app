import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup} from '@angular/forms';
import {YEARS} from '../../../_services/shared.service';
import {DataService} from '../../../_services/data.service';


export interface Course {
  courseID: number;
  courseName: string;
}

export const COURSES: Course[] = [
  {courseID: 1, courseName: 'MSC/PG DIPLOMA IN INFORMATION TECHNOLOGY'},
  {courseID: 2, courseName: 'MSC/PG DIPLOMA IN MULTIMEDIA TECHNOLOGY'},
];

@Component({
  selector: 'app-view-registration',
  templateUrl: './view-registration.component.html',
  styleUrls: ['./view-registration.component.css']
})
export class ViewRegistrationComponent implements OnInit {
  viewRegistrationsForm: FormGroup;
  viewRegistrationProgress: boolean;
  courses: Course[] = COURSES;
  years = YEARS;
  success = false;
  studentIDNotFound = false;

  error = '';
  registration: any;
  registrations: any;



  constructor(
    private formBuilder: FormBuilder,
    private data: DataService
  ) { }

  ngOnInit(): void {
  }

  get courseName() {
    return this.viewRegistrationsForm.get('courseName');
  }
  toggleProgress(): void {
    this.viewRegistrationProgress = true;
  }


  get academicYear(): AbstractControl {
    return this.viewRegistrationsForm.get('academicYear');
  }

  getRegistrations() {
    this.data.getRegistrations(this.viewRegistrationsForm.value).subscribe(
      response => {
        console.log(response);
      }, error => {
        console.log(error);
      }
    );
  }
}
