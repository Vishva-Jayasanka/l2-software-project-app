import {OnInit, Component, ViewChild, AfterViewInit} from '@angular/core';
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

export interface PeriodicElement {
  position: number;
  title: string;
  name: string;
  nic: string;
  email: string;
  mobile: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
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

@Component({
  selector: 'app-view-registration',
  templateUrl: './view-registration.component.html',
  styleUrls: ['./view-registration.component.css']
})
export class ViewRegistrationComponent implements OnInit, AfterViewInit {
  displayedColumns = ['position', 'title', 'name', 'nic', 'email', 'mobile'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  filterValue = '';
  viewRegistrationsForm: FormGroup;
  viewRegistrationProgress: false;
  courses: Course[] = COURSES;
  years = YEARS;
  success = false;
  studentIDNotFound = false;
  public show = false;
  public buttonName: any = 'Show';

  error = '';
  registration: any;
  registrations: any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private formBuilder: FormBuilder,
    private data: DataService
  ) { }
  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {
    this.viewRegistrationsForm = this.formBuilder.group({
      courseName: [1, [Validators.required]],
      academicYear: ['', [Validators.required]]
    });
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

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  get courseName() {
    return this.viewRegistrationsForm.get('courseName');
  }


}


