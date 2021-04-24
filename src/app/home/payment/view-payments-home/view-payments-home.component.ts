import {OnInit, Component, ElementRef, ViewChild, AfterViewInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {YEARS} from '../../../_services/shared.service';
import {DataService} from '../../../_services/data.service';
import {MatTableDataSource} from '@angular/material/table';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {AuthenticationService} from 'src/app/_services/authentication.service';
import {MatDialogRef} from '@angular/material/dialog';
import {DataSource} from '@angular/cdk/collections';

export interface Course {
  courseID: number;
  courseName: string;
}

export const COURSES: Course[] = [
  {courseID: 1, courseName: 'MSC/PG DIPLOMA IN INFORMATION TECHNOLOGY'},
  {courseID: 2, courseName: 'MSC/PG DIPLOMA IN MULTIMEDIA TECHNOLOGY'},
];

export interface PeriodicElement {
  position: number;
  regNo: string;
  title: string;
  name: string;
  totalPayment: number;
  courseName: string;
}


export interface PeriodicElementPending {
  position: number;
  regNo: string;
  title: string;
  name: string;
  paidAmount: number;
  courseName: string;
}


@Component({
  selector: 'app-view-payments-home',
  templateUrl: './view-payments-home.component.html',
  styleUrls: ['./view-payments-home.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ViewPaymentsHomeComponent implements OnInit, AfterViewInit {

  dataSourceConfirmed = new MatTableDataSource([]);
  confirmedStudentList = new MatTableDataSource([]);
  columnsToDisplayConfirmed = ['studentID', 'title', 'fullName', 'totalPayment', 'courseName'];
  expandedElementConfirmed: PeriodicElement | null;
  filterValue = '';
  filterValuePending = '';
  dataSourcePending;
  columnsToDisplayPending = ['position', 'studentID', 'title', 'fullName', 'amount', 'courseName'];
  expandedElementPending: PeriodicElementPending | null;
  viewPaymentsForm: FormGroup;
  viewPaymentsProgress: boolean;
  public show = false;
  public view = false;
  public buttonName: any = 'Show';
  public buttonNamePending = 'Show';
  courses: Course[] = COURSES;
  years = YEARS;
  user;

  error = '';
  success = false;

  @ViewChild('TableOnePaginator', {static: true}) tableOnePaginator: MatPaginator;
  @ViewChild('TableTwoPaginator', {static: true}) tableTwoPaginator: MatPaginator;
  @ViewChild('TableOneSort', {static: true}) tableOneSort: MatSort;
  @ViewChild('TableTwoSort', {static: true}) tableTwoSort: MatSort;


  constructor(
    private formBuilder: FormBuilder,
    private data: DataService,
    private elementRef: ElementRef,
    private authentication: AuthenticationService,
  ) {
  }


  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceConfirmed.filter = this.filterValue.trim().toLowerCase();
  }

  applyFilterPending(event: Event) {
    this.filterValuePending = (event.target as HTMLInputElement).value;
    this.dataSourcePending.filter = this.filterValuePending.trim().toLowerCase();
  }

  ngOnInit(): void {

    this.viewPaymentsProgress = true;
    this.error = '';
    this.success = false;
    this.data.getAcademicYears().subscribe(
      response => this.years = response.academicYears,
      error => this.error = error
    ).add(() => this.viewPaymentsProgress = false);

    this.viewPaymentsForm = this.formBuilder.group({
      courseName: [1, [Validators.required]],
      academicYear: [1, [Validators.required]]
    });
    this.user = this.authentication.details;
  }

  getConfirmedPaymentsList() {
    this.show = true;
    this.viewPaymentsProgress = true;
    this.error = '';
    this.success = false;
    this.data.getPaymentList({
      courseID: this.courseName.value,
      academicYear: this.academicYear.value,
      type: 'confirmed'
    }).subscribe(response => {
        console.log(response);
        this.dataSourceConfirmed = new MatTableDataSource(response.results[0]);
        this.confirmedStudentList = response.results[0];
        this.filterValue = '';
        this.dataSourceConfirmed.filter = '';
        this.viewPaymentsProgress = false;
      },
      error => console.log(error)
    ).add(() => setTimeout(() => this.viewPaymentsProgress = false, 1000));
  }

  togglePending() {
    this.view = !this.view;
    if (this.view) {
      this.buttonNamePending = 'Hide';
      this.getPendingPaymentsList();
    } else {
      this.buttonNamePending = 'Show';
    }

    this.filterValuePending = '';
    this.dataSourcePending.filter = '';

  }

  getPendingPaymentsList() {
    this.viewPaymentsProgress = true;
    this.data.getPaymentList({type: 'pending'}
    ).subscribe(response => {
        this.dataSourcePending = new MatTableDataSource(response.results[0]);
        this.filterValue = '';
        this.dataSourcePending.filter = '';
        this.viewPaymentsProgress = false;
      },
      error => console.log(error)
    ).add(() => setTimeout(() => this.viewPaymentsProgress = false, 1000));
  }

  ngAfterViewInit() {
    this.dataSourceConfirmed.paginator = this.tableOnePaginator;
    this.dataSourcePending.paginator = this.tableTwoPaginator;
    this.dataSourceConfirmed.sort = this.tableOneSort;
    this.dataSourcePending.sort = this.tableTwoSort;
  }


  get courseName() {
    return this.viewPaymentsForm.get('courseName');
  }

  get academicYear() {
    return this.viewPaymentsForm.get('academicYear');
  }

  get position() {
    return this.viewPaymentsForm.get('position');
  }

  get regNo() {
    return this.viewPaymentsForm.get('regNo');
  }

  get name() {
    return this.viewPaymentsForm.get('name');
  }

  get title() {
    return this.viewPaymentsForm.get('title');
  }

  get totalPayment() {
    return this.viewPaymentsForm.get('totalPayment');
  }


  get getRole() {
    return this.authentication.details.role;
  }

  get amount() {
    return this.viewPaymentsForm.get('amount');
  }

}

// -----------------------------------------------------------------------------------------------------------------------------------------
// confirm Update payment msg Component
// -----------------------------------------------------------------------------------------------------------------------------------------

@Component({
  selector: 'app-confirm-update-dialog',
  templateUrl: './confirm-update-dialog.component.html',
  styleUrls: ['./view-payments-home.component.css']
})

export class ConfirmUpdateDialogComponent implements OnInit {

  progress = false;
  error;
  private router: any;

  constructor(
    public dataService: DataService,
    public dialogRef: MatDialogRef<ConfirmUpdateDialogComponent>,
  ) {
  }

  ngOnInit() {
  }

}

// -----------------------------------------------------------------------------------------------------------------------------------------
// confirm Delete payment msg Component
// -----------------------------------------------------------------------------------------------------------------------------------------

@Component({
  selector: 'app-confirm-delete-dialog',
  templateUrl: './confirm-delete-dialog.component.html',
  styleUrls: ['./view-payments-home.component.css']
})

export class ConfirmDeleteDialogComponent implements OnInit {

  progress = false;
  error;
  private router: any;

  constructor(
    public dataService: DataService,
    public dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>,
  ) {
  }

  ngOnInit() {
  }

}
