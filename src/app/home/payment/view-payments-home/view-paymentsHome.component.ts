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

  dataSource = new MatTableDataSource(ELEMENT_DATA);
  columnsToDisplay = ['position', 'regNo', 'title', 'name', 'totalPayment', 'courseName', ];
  expandedElement: PeriodicElement | null;
  filterValue = '';
  dataSource2 = new MatTableDataSource(ELEMENT_DATA2);
  columnsToDisplay2 = ['position', 'regNo', 'title', 'name', 'totalPayment', 'courseName'];
  expandedElement2: PeriodicElement2 | null;
  viewPaymentsForm: FormGroup;
  viewPaymentsProgress: boolean;
  public show = false;
  public view = false;
  public buttonName: any = 'Show';
  public buttonName2: any = 'Show';
  courses: Course[] = COURSES;
  years = YEARS;
  title = 'ViewPaymentDetails';
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
    console.log('onchange');
    this.show = false;
    this.buttonName = 'show';
  }
  toggle() {
    this.show = !this.show;
    this.filterValue = '';
    this.dataSource.filter = '';


    if (this.show) {
      this.buttonName = 'Hide';
    }
    else {
      this.buttonName = 'Show';
    }
  }

  getConfirmedPaymentsList(){
    this.viewPaymentsProgress = true;
    this.data.getConfirmedPaymentsList().subscribe(response => {
      this.dataSource = new MatTableDataSource(response.results[0]);
      this.filterValue = '';
      this.dataSource.filter = '';
      this.viewPaymentsProgress = false;
    });
  }

  toggle2() {
    this.show = !this.show;
    this.filterValue = '';
    this.dataSource2.filter = '';

    if (this.show) {
      this.buttonName2 = 'Hide';
    }
    else {
      this.buttonName2 = 'Show';
    }
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

  get getRole() {
    return this.authentication.details.role;
  }

  do(){
    this.buttonName = 'Show';
  }
  uploadPayments(){

  }

}
export interface PeriodicElement {
  position: number;
  regNo: string;
  title: string;
  name: string;
  totalPayment: number;
  courseName: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 1,
    regNo: '184021R',
    title: 'Mr.',
    name: 'Sadun Alwis',
    totalPayment: 150500,
    courseName: 'MSC/PG DIPLOMA IN INFORMATION TECHNOLOGY',
  }, {
    position: 2,
    regNo: '184061R',
    title: 'Mr.',
    name: 'Vishwa Jayasanka Atapattu',
    totalPayment: 200000,
    courseName: 'MSC/PG DIPLOMA IN INFORMATION TECHNOLOGY',
  }, {
    position: 3,
    regNo: '184032B',
    title: 'Ms.',
    name: 'Tharushi Weerasingha',
    totalPayment: 150500,
    courseName: 'MSC/PG DIPLOMA IN INFORMATION TECHNOLOGYH',
  }, {
    position: 4,
    regNo: '185083K',
    title: 'Mrs.',
    name: '	Saduni Perera',
    totalPayment: 200000,
    courseName: 'MSC/PG DIPLOMA IN MULTIMEDIA TECHNOLOGY',
  }, {
    position: 5,
    regNo: '185065H',
    title: 'Mr.',
    name: 'Ravidu Shamika Kulathunga',
    totalPayment: 350500,
    courseName: 'MSC/PG DIPLOMA IN MULTIMEDIA TECHNOLOGY',
  }, {
    position: 6,
    regNo: '184183R',
    title: 'Ms.',
    name: 'Onali Vithanage',
    totalPayment: 160500,
    courseName: 'MSC/PG DIPLOMA IN INFORMATION TECHNOLOGY',
  }, {
    position: 7,
    regNo: '185090L',
    title: 'Mrs.',
    name: 'Thilini Wijekoon',
    totalPayment: 350500,
    courseName: 'MSC/PG DIPLOMA IN MULTIMEDIA TECHNOLOGY',
  }
];


export interface PeriodicElement2 {
  position: number;
  regNo: string;
  title: string;
  name: string;
  totalPayment: number;
  courseName: string;
}

const ELEMENT_DATA2: PeriodicElement2[] = [
  {
    position: 1,
    regNo: '184065X',
    title: 'Ms.',
    name: '	Nethmi Bimsara Jayasekara',
    totalPayment: 250500,
    courseName: 'MSC/PG DIPLOMA IN INFORMATION TECHNOLOGY',
  }, {
    position: 2,
    regNo: '184077N',
    title: 'Mr.',
    name: 'Kavidu Yasith Katuwandeniya',
    totalPayment: 200000,
    courseName: 'MSC/PG DIPLOMA IN INFORMATION TECHNOLOGY',
  }, {
    position: 3,
    regNo: '185083K',
    title: 'Mrs.',
    name: '	Saduni Perera',
    totalPayment: 150500,
    courseName: 'MSC/PG DIPLOMA IN MULTIMEDIA TECHNOLOGY',
  }, {
    position: 4,
    regNo: '184183R',
    title: 'Ms.',
    name: 'Onali Vithanage',
    totalPayment: 140500,
    courseName: 'MSC/PG DIPLOMA IN INFORMATION TECHNOLOGY',
  }, {
    position: 5,
    regNo: '185021M',
    title: 'Ms.',
    name: 'Naduni Thakshila Bandara',
    totalPayment: 350500,
    courseName: 'MSC/PG DIPLOMA IN MULTIMEDIA TECHNOLOGY',

  }, {
    position: 6,
    regNo: '184061R',
    title: 'Mr.',
    name: 'Vishwa Jayasanka Atapattu',
    totalPayment: 150500,
    courseName: 'MSC/PG DIPLOMA IN INFORMATION TECHNOLOGY',
  }, {
    position: 7,
    regNo: '184021R',
    title: 'Mr.',
    name: 'Sadun Alwis',
    totalPayment: 150000,
    courseName: 'MSC/PG DIPLOMA IN INFORMATION TECHNOLOGY',
  }, {
    position: 8,
    regNo: '185003A',
    title: 'Mr.',
    name: 'Chathura Perera',
    totalPayment: 350500,
    courseName: 'MSC/PG DIPLOMA IN MULTIMEDIA TECHNOLOGY',
  }, {
    position: 9,
    regNo: '184050J',
    title: 'Mr.',
    name: 'Vihanaga Godakubura',
    totalPayment: 250000,
    courseName: 'MSC/PG DIPLOMA IN INFORMATION TECHNOLOGY',
  }
];

