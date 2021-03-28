import {OnInit, Component, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {YEARS} from '../../../_services/shared.service';
import {DataService} from '../../../_services/data.service';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';

export interface Course {
  courseID: number;
  courseName: string;
}

export const COURSES: Course[] = [
  {courseID: 1, courseName: 'MSC/PG DIPLOMA IN INFORMATION TECHNOLOGY'},
  {courseID: 2, courseName: 'MSC/PG DIPLOMA IN MULTIMEDIA TECHNOLOGY'},
];

export interface PeriodicElement1 {
  position: number;
  regNo: string;
  title: string;
  name: string;
  totalPayment: number;
  courseName: string;
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  {position: 1, regNo: '184183R', title: 'Mr', name: 'Hydrogen', totalPayment: 995240424, courseName: 'onalisharindi@gmail.com'},
  {position: 2, regNo: '184183R', title: 'Mr', name: 'Helium', totalPayment: 995240424, courseName: 'onalisharindi@gmail.com'},
  {position: 3, regNo: '184183R', title: 'Mr', name: 'Lithium', totalPayment: 995240424, courseName: 'onalisharindi@gmail.com'},
  {position: 4, regNo: '184183R', title: 'Mr', name: 'Beryllium', totalPayment: 995240424, courseName: 'onalisharindi@gmail.com'},
  {position: 5, regNo: '184183R', title: 'Mr', name: 'Boron', totalPayment: 995240424, courseName: 'onalisharindi@gmail.com'},
  {position: 6, regNo: '184183R', title: 'Mr', name: 'Carbon', totalPayment: 995240424, courseName: 'onalisharindi@gmail.com'},
  {position: 7, regNo: '184183R', title: 'Mr', name: 'Nitrogen', totalPayment: 995240424, courseName: 'onalisharindi@gmail.com'},
  {position: 8, regNo: '184183R', title: 'Mr', name: 'Oxygen', totalPayment: 995240424, courseName: 'onalisharindi@gmail.com'},
  {position: 9, regNo: '184183R', title: 'Mr', name: 'Fluorine', totalPayment: 995240424, courseName: 'onalisharindi@gmail.com'},
  {position: 10, regNo: '184183R', title: 'Mr', name: 'Neon', totalPayment: 995240424, courseName: 'onalisharindi@gmail.com'},
  {position: 11, regNo: '184183R', title: 'Mr', name: 'Sodium', totalPayment: 995240424, courseName: 'onalisharindi@gmail.com'},
  {position: 12, regNo: '184183R', title: 'Mr', name: 'Magnesium', totalPayment: 995240424, courseName: 'onalisharindi@gmail.com'},
  {position: 13, regNo: '184183R', title: 'Mr', name: 'Aluminum', totalPayment: 995240424, courseName: 'onalisharindi@gmail.com'},
  {position: 14, regNo: '184183R', title: 'Mr', name: 'Silicon', totalPayment: 995240424, courseName: 'onalisharindi@gmail.com'},
  {position: 15, regNo: '184183R', title: 'Mr', name: 'Phosphorus', totalPayment: 995240424, courseName: 'onalisharindi@gmail.com'},
  {position: 16, regNo: '184183R', title: 'Mr', name: 'Sulfur', totalPayment: 995240424, courseName: 'onalisharindi@gmail.com'},
  {position: 17, regNo: '184183R', title: 'Mr', name: 'Chlorine', totalPayment: 995240424, courseName: 'onalisharindi@gmail.com'},
];


export interface PeriodicElement2 {
  position: number;
  regNo: string;
  name: string;
  courseName: string;
  bank: string;
  date: number;
}

const ELEMENT_DATA2: PeriodicElement2[] = [
  {position: 1, regNo: 'Mr', name: 'Hydrogen',  courseName: '995240424V', bank: 'onalisharindi@gmail.com', date: +94714240853},
  {position: 2, regNo: 'Mr', name: 'Helium',  courseName: '995240424V', bank: 'onalisharindi@gmail.com', date: +94714240853},
  {position: 3, regNo: 'Mr', name: 'Lithium',  courseName: '995240424V', bank: 'onalisharindi@gmail.com', date: +94714240853},
  {position: 4, regNo: 'Mr', name: 'Beryllium',  courseName: '995240424V', bank: 'onalisharindi@gmail.com', date: +94714240853},
  {position: 5, regNo: 'Mr', name: 'Boron',  courseName: '995240424V', bank: 'onalisharindi@gmail.com', date: +94714240853},
  {position: 6, regNo: 'Mr', name: 'Carbon',  courseName: '995240424V', bank: 'onalisharindi@gmail.com', date: +94714240853},
  {position: 7, regNo: 'Mr', name: 'Nitrogen',  courseName: '995240424V', bank: 'onalisharindi@gmail.com', date: +94714240853},
];


@Component({
  selector: 'app-view-payments',
  templateUrl: './view-payments.component.html',
  styleUrls: ['./view-payments.component.css']
})
export class ViewPaymentsComponent implements OnInit {
  displayedColumns1 = ['position', 'regNo', 'title', 'name', 'totalPayment', 'courseName'];
  table1 = new MatTableDataSource(ELEMENT_DATA1);

  displayedColumns2 = ['position', 'regNo', 'name', 'courseName', 'bank', 'date'];
  table2 = new MatTableDataSource(ELEMENT_DATA2);

  filterValue = '';
  viewConfirmedPaymentsForm: FormGroup;
  viewPaymentsProgress: false;
  courses: Course[] = COURSES;
  years = YEARS;
  success = false;
  studentIDNotFound = false;
  public show = false;
  public buttonName: any = 'Show';

  error = '';
  registration: any;
  registrations: any;

  @ViewChild('sorter1') sorter1: MatSort;
  @ViewChild('paginator1') paginator1: MatPaginator;
  @ViewChild('sorter2') sorter2: MatSort;
  @ViewChild('paginator2') paginator2: MatPaginator;

  constructor(
    private formBuilder: FormBuilder,
    private data: DataService
  ) { }
  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.table1.filter = this.filterValue.trim().toLowerCase();
  }

  applyFilter2(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.table2.filter = this.filterValue.trim().toLowerCase();
  }
  ngOnInit(): void {
    this.viewConfirmedPaymentsForm = this.formBuilder.group({
      courseName: [1, [Validators.required]],
      academicYear: ['', [Validators.required]]
    });

  }


  toggle() {
    this.show = !this.show;
    this.table1.filter = '';
    this.table2.filter = '';
    this.filterValue = '';

    if (this.show) {
      this.buttonName = 'Hide';
    }
    else {
      this.buttonName = 'Show';
    }
  }


  get courseName() {
    return this.viewConfirmedPaymentsForm.get('courseName');
  }

}
