import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup} from '@angular/forms';
import {DataService} from '../../../../_services/data.service';
import {MatTableDataSource} from '@angular/material/table';
import { AuthenticationService } from 'src/app/_services/authentication.service';



export interface PeriodicElement {
  no: number;
  slipNo: string;
  bank: string;
  date: string;
  paidAmount: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {no: 1, slipNo: '1254678903', bank: 'BOC', date: '28/02/2021', paidAmount: 200000.00},
  {no: 2, slipNo: '2434567234', bank: 'BOC', date: '20/03/2021', paidAmount: 150500.00},
];

@Component({
  selector: 'app-view-payments',
  templateUrl: './view-payments.component.html',
  styleUrls: ['./view-payments.component.css']
})

export class ViewPaymentsComponent implements OnInit {
  @Input('confirmedStudentPaymentDetails') confirmedStudentPaymentDetails;
  displayedColumns: string[] = ['no', 'slipNo', 'bank', 'date', 'paidAmount'];
  dataSource = new MatTableDataSource([]);
  filterValue = '';
  viewPaymentForm: FormGroup;
  viewPaymentProgress: boolean;
  success = false;
  error = '';
  private total = 0;
  private value;
  r;



  constructor(
    private formBuilder: FormBuilder,
    private data: DataService,
    private authentication: AuthenticationService,
    private elementRef: ElementRef
  ) {
  }

 getStudentData(){
  this.viewPaymentProgress = true;
  this.data.getStudentPaymentLists().subscribe(
      response => {
        if (response.status) {
          this.dataSource = new MatTableDataSource(response.results[0]);
        } else {
          this.viewPaymentProgress = true;
        }
      },
      error => this.error = error
    ).add(() => this.viewPaymentProgress = false);
  this.viewPaymentProgress = false;
 }


  getData(studentId: string){
    if (studentId) {
    this.data.getStudentPaymentList(studentId).subscribe(
      response => {
        if (response.status) {
          this.dataSource = new MatTableDataSource(response.results[0]);
        } else {
          this.viewPaymentProgress = true;
        }
      },
      error => this.error = error
    ).add(() => this.viewPaymentProgress = false);
  } else {
    this.viewPaymentProgress = false;
  }
}


  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
   // this.dataSource.filter = this.filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {
   if (this.getRole !== 'Student'){
    console.log('confirmedStudentPaymentDetails = ', this.confirmedStudentPaymentDetails);
    this.getData(this.confirmedStudentPaymentDetails.studentID);
   } else if (this.getRole !== 'Admin'){
    this.getStudentData();
   }
  }

  get getRole() {
    return this.authentication.details.role;
  }


  get bank(): AbstractControl  {
    return this.viewPaymentForm.get('bank');
  }


  get date(): AbstractControl  {
    return this.viewPaymentForm.get('date');
  }

  get no(): AbstractControl  {
    return this.viewPaymentForm.get('no');
  }


  get slipNo(): AbstractControl  {
    return this.viewPaymentForm.get('slipNo');
  }

  get paidAmount(): AbstractControl  {
    return this.viewPaymentForm.get('paidAmount');
  }


}
