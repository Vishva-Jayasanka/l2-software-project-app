import {OnInit, Component, ViewChild, AfterViewInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {YEARS} from '../../../_services/shared.service';
import {DataService} from '../../../_services/data.service';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ProfileDetailsDialogComponent } from '../registration.component';

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
  {position: 1, title: 'Mr', name: 'Sadun Alwis', nic: '986040495V', email: 'sadunalwis@gmail.com', mobile: +94711240735},
  {position: 2, title: 'Ms', name: 'Vishwa Jaysanka Atapattu', nic: '981251721V', email: 'vishwajayasanka@gmail.com', mobile: +94774253323},
  {position: 3, title: 'Ms', name: 'Naduni Thakshila Bandara', nic: '976121321V', email: 'nadunibandara@gmail.com', mobile: +94773103834},
  {position: 4, title: 'Ms', name: 'Tharushi Weerasingha', nic: '984242405V', email: 'tharushiweerasingha@gmail.com', mobile: +94778112974},
  {position: 5, title: 'Mr', name: 'Kavidu Yasith Katuwandeniya', nic: '977700783V', email: 'kaviduyasith@gmail.com', mobile: +94714228357},
  {position: 6, title: 'Mrs', name: 'Saduni Perera', nic: '981140404V', email: 'saduniperera@gmail.com', mobile: +94719114287},
  {position: 7, title: 'Mr', name: 'Ravidu Shamika Kulathunga', nic: '982244405V', email: 'ravidukulath@gmail.com', mobile: +94777893550},
  {position: 8, title: 'Ms', name: 'Onali Vithanage', nic: '995240424V', email: 'onalisharindi@gmail.com', mobile: +94714240853},
  {position: 9, title: 'Ms', name: 'Nethmi Bimsara Jayasekara', nic: '976548122V', email: 'nethmibimsara@gmail.com', mobile: +94784965273},
  {position: 10, title: 'Mrs', name: 'Thilini Wijekoon', nic: '971100407V', email: 'thiliniwijekoon@gmail.com', mobile: +94717477578},
  {position: 11, title: 'Mr', name: 'Vihanaga Godakubura', nic: '975645340V', email: 'vihangagodakubura@gmail.com', mobile: +94777710280},
  {position: 12, title: 'Mr', name: 'Chathura Perera', nic: '981254880V', email: 'chathuraperera@gmail.com', mobile: +94776651844},
];

@Component({
  selector: 'app-view-registration',
  templateUrl: './view-registration.component.html',
  styleUrls: ['./view-registration.component.css']
})
export class ViewRegistrationComponent implements OnInit, AfterViewInit {
  displayedColumns = ['position', 'title', 'name', 'nic', 'email', 'mobile', 'customDataColumn'];
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
    private data: DataService,
    public dialog: MatDialog
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

  openProfileDetailsDialog(){
    const dialogRef = this.dialog.open(ProfileDetailsDialogComponent, {
      width: '450px',

      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
      }
    });
  }

}

