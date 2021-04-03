import {OnInit, Component, ElementRef, ViewChild, AfterViewInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {YEARS} from '../../../_services/shared.service';
import {DataService} from '../../../_services/data.service';
import {MatTableDataSource} from '@angular/material/table';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatPaginator} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AuthenticationService } from 'src/app/_services/authentication.service';

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

@Component({
  selector: 'app-view-payments-home',
  templateUrl: './view-paymentsHome.component.html',
  styleUrls: ['./view-paymentsHome.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ViewPaymentsHomeComponent implements OnInit, AfterViewInit {

  dataSource;
  columnsToDisplay = ['position', 'studentID', 'title', 'fullName', 'totalPayment', 'courseName', ];
  expandedElement: PeriodicElement | null;
  filterValue = '';
  dataSource2;
  columnsToDisplay2 = ['position', 'studentID', 'title', 'fullName', 'totalPayment', 'courseName'];
  expandedElement2: PeriodicElement2 | null;
  viewPaymentsForm: FormGroup;
  viewPaymentsProgress: boolean;
  public show = false;
  public view = false;
  public buttonName: any = 'Show';
  public buttonName2: any = 'Show';
  courses: Course[] = COURSES;
  years = YEARS;
  user;

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
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
  }

  applyFilter2(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = this.filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {
    this.viewPaymentsForm = this.formBuilder.group({
      courseName: [1, [Validators.required]],
      academicYear: ['', [Validators.required]]
    });
    this.user = this.authentication.details;
  }
  onChange(){
    this.show = false;
    this.buttonName = 'show';
  }
  toggle() {
    this.show = !this.show;
    this.filterValue = '';
    this.dataSource.filter = '';


    if (this.show) {
      this.buttonName = 'Hide';
      this.getConfirmedPaymentsList();
    }
    else {
      this.buttonName = 'Show';
    }
  }

  getConfirmedPaymentsList(){
    this.viewPaymentsProgress = true;
    this.data.getPaymentList({
      courseID: this.courseName.value,
      academicYear: this.years[this.academicYear.value].value,
      type: 'confirmed'
     }).subscribe(response => {
      this.dataSource = new MatTableDataSource(response.results[0]);
      this.filterValue = '';
      this.dataSource.filter = '';
      this.viewPaymentsProgress = false;
    },
    error => console.log(error)
  ).add(() => setTimeout(() => this.viewPaymentsProgress = false, 1000));
  }

  toggle2() {
    this.show = !this.show;
    this.filterValue = '';
    this.dataSource2.filter = '';

    if (this.show) {
      this.buttonName2 = 'Hide';
      this.getPendingPaymentsList();
    }
    else {
      this.buttonName2 = 'Show';
    }
  }

  getPendingPaymentsList(){
    this.viewPaymentsProgress = true;
    console.log('getPendingPaymentsList');
    this.data.getPaymentList(
      {
        type: 'pending'
      }
    ).subscribe(response => {
      this.dataSource2 = new MatTableDataSource(response.results[0]);
      this.filterValue = '';
      this.dataSource2.filter = '';
      this.viewPaymentsProgress = false;
    },
    error => console.log(error)
  ).add(() => setTimeout(() => this.viewPaymentsProgress = false, 1000));
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.tableOnePaginator;
    this.dataSource2.paginator = this.tableTwoPaginator;

    this.dataSource.sort = this.tableOneSort;
    this.dataSource2.sort = this.tableTwoSort;
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

  do(){
    this.buttonName = 'Show';
  }
  uploadPayments(){

  }

}


export interface PeriodicElement2 {
  position: number;
  regNo: string;
  title: string;
  name: string;
  totalPayment: number;
  courseName: string;
}


