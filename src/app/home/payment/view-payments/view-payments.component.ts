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
  title: string;
  name: string;
  nic: string;
  email: string;
  mobile: number;
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  {position: 1, title: 'Mr', name: 'Hydrogen', nic: '995240424V', email: 'onalisharindi@gmail.com', mobile: +94714240853},
  {position: 2, title: 'Mr', name: 'Helium', nic: '995240424V', email: 'onalisharindi@gmail.com', mobile: +94714240853},
  {position: 3, title: 'Mr', name: 'Lithium', nic: '995240424V', email: 'onalisharindi@gmail.com', mobile: +94714240853},
  {position: 4, title: 'Mr', name: 'Beryllium', nic: '995240424V', email: 'onalisharindi@gmail.com', mobile: +94714240853},
  {position: 5, title: 'Mr', name: 'Boron', nic: '995240424V', email: 'onalisharindi@gmail.com', mobile: +94714240853},
  {position: 6, title: 'Mr', name: 'Carbon', nic: '995240424V', email: 'onalisharindi@gmail.com', mobile: +94714240853},
  {position: 7, title: 'Mr', name: 'Nitrogen', nic: '995240424V', email: 'onalisharindi@gmail.com', mobile: +94714240853},
  {position: 8, title: 'Mr', name: 'Oxygen', nic: '995240424V', email: 'onalisharindi@gmail.com', mobile: +94714240853},
  {position: 9, title: 'Mr', name: 'Fluorine', nic: '995240424V', email: 'onalisharindi@gmail.com', mobile: +94714240853},
  {position: 10, title: 'Mr', name: 'Neon', nic: '995240424V', email: 'onalisharindi@gmail.com', mobile: +94714240853},
  {position: 11, title: 'Mr', name: 'Sodium', nic: '995240424V', email: 'onalisharindi@gmail.com', mobile: +94714240853},
  {position: 12, title: 'Mr', name: 'Magnesium', nic: '995240424V', email: 'onalisharindi@gmail.com', mobile: +94714240853},
  {position: 13, title: 'Mr', name: 'Aluminum', nic: '995240424V', email: 'onalisharindi@gmail.com', mobile: +94714240853},
  {position: 14, title: 'Mr', name: 'Silicon', nic: '995240424V', email: 'onalisharindi@gmail.com', mobile: +94714240853},
  {position: 15, title: 'Mr', name: 'Phosphorus', nic: '995240424V', email: 'onalisharindi@gmail.com', mobile: +94714240853},
  {position: 16, title: 'Mr', name: 'Sulfur', nic: '995240424V', email: 'onalisharindi@gmail.com', mobile: +94714240853},
  {position: 17, title: 'Mr', name: 'Chlorine', nic: '995240424V', email: 'onalisharindi@gmail.com', mobile: +94714240853},
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
  displayedColumns1 = ['position', 'title', 'name', 'nic', 'email', 'mobile'];
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
