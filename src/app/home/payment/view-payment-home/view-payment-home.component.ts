import {Component, ElementRef, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DataService} from '../../../_services/data.service';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {EMPTY, Subject, Subscription} from 'rxjs';
import {YEARS} from '../../../_services/shared.service';

export interface Course {
  courseID: number;
  courseName: string;
}

export const COURSES: Course[] = [
  {courseID: 1, courseName: 'MSC/PG DIPLOMA IN INFORMATION TECHNOLOGY'},
  {courseID: 2, courseName: 'MSC/PG DIPLOMA IN MULTIMEDIA TECHNOLOGY'},
];

@Component({
  selector: 'app-view-payment',
  templateUrl: './view-payment-home.component.html',
  styleUrls: ['./view-payment-home.component.css']
})
export class ViewPaymentHomeComponent implements OnInit {
  viewPaymentsForm: FormGroup;
  viewPaymentsProgress: boolean;
  studentIDNotFound = false;
  courses: Course[] = COURSES;
  years = YEARS;
  success = false;

  error = '';


  constructor(
    private formBuilder: FormBuilder,
    private data: DataService,
    private elementRef: ElementRef
  ) {
  }

  ngOnInit(): void {
    this.viewPaymentsForm = this.formBuilder.group({
      courseName: [1, [Validators.required]],
      academicYear: ['', [Validators.required]]
    });

  }

  get courseName() {
    return this.viewPaymentsForm.get('courseName');
  }

}
