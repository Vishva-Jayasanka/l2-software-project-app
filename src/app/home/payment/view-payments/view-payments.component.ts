import {OnInit, Component, ElementRef, ViewChild, AfterViewInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {YEARS} from '../../../_services/shared.service';
import {DataService} from '../../../_services/data.service';
import {MatTableDataSource} from '@angular/material/table';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatPaginator} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

export interface Course {
  courseID: number;
  courseName: string;
}

export const COURSES: Course[] = [
  {courseID: 1, courseName: 'MSC/PG DIPLOMA IN INFORMATION TECHNOLOGY'},
  {courseID: 2, courseName: 'MSC/PG DIPLOMA IN MULTIMEDIA TECHNOLOGY'},
];


@Component({
  selector: 'app-view-payments',
  templateUrl: './view-payments.component.html',
  styleUrls: ['./view-payments.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ViewPaymentsComponent implements OnInit, AfterViewInit {

  dataSource = new MatTableDataSource(ELEMENT_DATA);
  columnsToDisplay = ['position', 'regNo', 'title', 'name', 'totalPayment', 'courseName', ];
  expandedElement: PeriodicElement | null;
  filterValue = '';
  dataSource2 = new MatTableDataSource(ELEMENT_DATA2);
  columnsToDisplay2 = ['position', 'regNo', 'title', 'name', 'totalPayment', 'courseName', ];
  expandedElement2: PeriodicElement2 | null;
  viewPaymentsForm: FormGroup;
  viewPaymentsProgress: false;
  public show = false;
  public buttonName: any = 'Show';
  courses: Course[] = COURSES;
  years = YEARS;


  @ViewChild('TableOnePaginator', {static: true}) tableOnePaginator: MatPaginator;
  @ViewChild('TableTwoPaginator', {static: true}) tableTwoPaginator: MatPaginator;
  @ViewChild('TableOneSort', {static: true}) tableOneSort: MatSort;
  @ViewChild('TableTwoSort', {static: true}) tableTwoSort: MatSort;

  constructor(
    private formBuilder: FormBuilder,
    private data: DataService,
    private elementRef: ElementRef
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
  }

  toggle() {
    this.show = !this.show;
    this.filterValue = '';
    this.dataSource.filter = '';
    this.dataSource2.filter = '';

    if (this.show) {
      this.buttonName = 'Hide';
    }
    else {
      this.buttonName = 'Show';
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



}
export interface PeriodicElement {
  position: number;
  regNo: string;
  title: string;
  name: string;
  totalPayment: number;
  courseName: string;
  description: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 1,
    regNo: '184021R',
    title: 'Mr.',
    name: 'Sadun Alwis',
    totalPayment: 150500,
    courseName: 'MSC/PG DIPLOMA IN INFORMATION TECHNOLOGY',
    description: `Hydrogen is a chemical element with symbol H and atomic number 1. With a standard
        atomic weight of 1.008, hydrogen is the lightest element on the periodic table.`
  }, {
    position: 2,
    regNo: '184061R',
    title: 'Mr.',
    name: 'Vishwa Jayasanka Atapattu',
    totalPayment: 200000,
    courseName: 'MSC/PG DIPLOMA IN INFORMATION TECHNOLOGY',
    description: `Hydrogen is a chemical element with symbol H and atomic number 1. With a standard
        atomic weight of 1.008, hydrogen is the lightest element on the periodic table.`
  }, {
    position: 3,
    regNo: '184032B',
    title: 'Ms.',
    name: 'Tharushi Weerasingha',
    totalPayment: 150500,
    courseName: 'MSC/PG DIPLOMA IN INFORMATION TECHNOLOGYH',
    description: `Hydrogen is a chemical element with symbol H and atomic number 1. With a standard
        atomic weight of 1.008, hydrogen is the lightest element on the periodic table.`
  }, {
    position: 4,
    regNo: '185083K',
    title: 'Mrs.',
    name: '	Saduni Perera',
    totalPayment: 200000,
    courseName: 'MSC/PG DIPLOMA IN MULTIMEDIA TECHNOLOGY',
    description: `Hydrogen is a chemical element with symbol H and atomic number 1. With a standard
        atomic weight of 1.008, hydrogen is the lightest element on the periodic table.`
  }, {
    position: 5,
    regNo: '185065H',
    title: 'Mr.',
    name: 'Ravidu Shamika Kulathunga',
    totalPayment: 350500,
    courseName: 'MSC/PG DIPLOMA IN MULTIMEDIA TECHNOLOGY',
    description: `Hydrogen is a chemical element with symbol H and atomic number 1. With a standard
        atomic weight of 1.008, hydrogen is the lightest element on the periodic table.`
  }, {
    position: 6,
    regNo: '184183R',
    title: 'Ms.',
    name: 'Onali Vithanage',
    totalPayment: 160500,
    courseName: 'MSC/PG DIPLOMA IN INFORMATION TECHNOLOGY',
    description: `Hydrogen is a chemical element with symbol H and atomic number 1. With a standard
        atomic weight of 1.008, hydrogen is the lightest element on the periodic table.`
  }, {
    position: 7,
    regNo: '185090L',
    title: 'Mrs.',
    name: 'Thilini Wijekoon',
    totalPayment: 350500,
    courseName: 'MSC/PG DIPLOMA IN MULTIMEDIA TECHNOLOGY',
    description: `Hydrogen is a chemical element with symbol H and atomic number 1. With a standard
        atomic weight of 1.008, hydrogen is the lightest element on the periodic table.`
  }
];


export interface PeriodicElement2 {
  position: number;
  regNo: string;
  title: string;
  name: string;
  totalPayment: number;
  courseName: string;
  description: string;
}

const ELEMENT_DATA2: PeriodicElement2[] = [
  {
    position: 1,
    regNo: '184065X',
    title: 'Ms.',
    name: '	Nethmi Bimsara Jayasekara',
    totalPayment: 250500,
    courseName: 'MSC/PG DIPLOMA IN INFORMATION TECHNOLOGY',
    description: `Hydrogen is a chemical element with symbol H and atomic number 1. With a standard
        atomic weight of 1.008, hydrogen is the lightest element on the periodic table.`
  }, {
    position: 2,
    regNo: '184077N',
    title: 'Mr.',
    name: 'Kavidu Yasith Katuwandeniya',
    totalPayment: 200000,
    courseName: 'MSC/PG DIPLOMA IN INFORMATION TECHNOLOGY',
    description: `Hydrogen is a chemical element with symbol H and atomic number 1. With a standard
        atomic weight of 1.008, hydrogen is the lightest element on the periodic table.`
  }, {
    position: 3,
    regNo: '185083K',
    title: 'Mrs.',
    name: '	Saduni Perera',
    totalPayment: 150500,
    courseName: 'MSC/PG DIPLOMA IN MULTIMEDIA TECHNOLOGY',
    description: `Hydrogen is a chemical element with symbol H and atomic number 1. With a standard
        atomic weight of 1.008, hydrogen is the lightest element on the periodic table.`
  }, {
    position: 4,
    regNo: '184183R',
    title: 'Ms.',
    name: 'Onali Vithanage',
    totalPayment: 140500,
    courseName: 'MSC/PG DIPLOMA IN INFORMATION TECHNOLOGY',
    description: `Hydrogen is a chemical element with symbol H and atomic number 1. With a standard
        atomic weight of 1.008, hydrogen is the lightest element on the periodic table.`
  }, {
    position: 5,
    regNo: '185021M',
    title: 'Ms.',
    name: 'Naduni Thakshila Bandara',
    totalPayment: 350500,
    courseName: 'MSC/PG DIPLOMA IN MULTIMEDIA TECHNOLOGY',
    description: `Hydrogen is a chemical element with symbol H and atomic number 1. With a standard
        atomic weight of 1.008, hydrogen is the lightest element on the periodic table.`
  }, {
    position: 6,
    regNo: '184061R',
    title: 'Mr.',
    name: 'Vishwa Jayasanka Atapattu',
    totalPayment: 150500,
    courseName: 'MSC/PG DIPLOMA IN INFORMATION TECHNOLOGY',
    description: `Hydrogen is a chemical element with symbol H and atomic number 1. With a standard
        atomic weight of 1.008, hydrogen is the lightest element on the periodic table.`
  }, {
    position: 7,
    regNo: '184021R',
    title: 'Mr.',
    name: 'Sadun Alwis',
    totalPayment: 150000,
    courseName: 'MSC/PG DIPLOMA IN INFORMATION TECHNOLOGY',
    description: `Hydrogen is a chemical element with symbol H and atomic number 1. With a standard
        atomic weight of 1.008, hydrogen is the lightest element on the periodic table.`
  }, {
    position: 8,
    regNo: '185003A',
    title: 'Mr.',
    name: 'Chathura Perera',
    totalPayment: 350500,
    courseName: '',
    description: `Hydrogen is a chemical element with symbol H and atomic number 1. With a standard
        atomic weight of 1.008, hydrogen is the lightest element on the periodic table.`
  }, {
    position: 9,
    regNo: '184050J',
    title: 'Mr.',
    name: 'Vihanaga Godakubura',
    totalPayment: 250000,
    courseName: 'MSC/PG DIPLOMA IN INFORMATION TECHNOLOGY',
    description: `Hydrogen is a chemical element with symbol H and atomic number 1. With a standard
        atomic weight of 1.008, hydrogen is the lightest element on the periodic table.`
  }
];

