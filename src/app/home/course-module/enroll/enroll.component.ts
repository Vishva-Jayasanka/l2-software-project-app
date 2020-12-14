import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {YEARS} from '../../../_services/shared.service';
import {DataService} from '../../../_services/data.service';

export interface Student {
  studentID: string;
  firstName: string;
  lastName: string;
}

@Component({
  selector: 'app-enroll',
  templateUrl: './enroll.component.html',
  styleUrls: ['./enroll.component.css', '../course-module.component.css']
})
export class EnrollComponent implements OnInit {

  enrollProgress = false;

  semesters: string[] = ['Level 1 Semester 1', 'Level 1 Semester 2', 'Level 2 Semester 1', 'Level 2 Semester 2'];
  students: Student[] = [];

  enrollmentForm: FormGroup;

  batches = YEARS;

  constructor(
    private formBuilder: FormBuilder,
    private data: DataService
  ) {
  }

  ngOnInit(): void {
    this.enrollmentForm = this.formBuilder.group({
      batch: ['', Validators.required],
      semester: ['', Validators.required]
    });
  }

  getStudents() {
    this.enrollProgress = true;
    this.data.getStudentsOfBatch(parseInt(this.batch.value, 10) + 1).subscribe(
      response => console.log(response),
      error => console.log(error)
    ).add(() => this.enrollProgress = false);
  }

  get batch() {
    return this.enrollmentForm.get('batch');
  }

  get semester() {
    return this.enrollmentForm.get('semester');
  }

}
