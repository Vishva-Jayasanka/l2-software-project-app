import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DataService} from '../../../../_services/data.service';
import {MatTableDataSource} from '@angular/material/table';


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

export class ViewPaymentsComponents implements OnInit {
  @Input('confirmedStudentPaymentDetails') confirmedStudentPaymentDetails;
  displayedColumns = ['no', 'slipNo', 'bank', 'date', 'paidAmount'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  filterValue = '';
  viewPaymentForm: FormGroup;
  viewPaymentProgress: boolean;
  success = false;
  error = '';


  constructor(
    private formBuilder: FormBuilder,
    private data: DataService,
    private elementRef: ElementRef
  ) {
  }



  getData(studentId: string){
    this.viewPaymentProgress = true;
    if (studentId) {
    this.data.getStudentPaymentList(studentId).subscribe(
      response => {
        if (response.status) {
          this.dataSource = response.results[0];
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
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {
   console.log('confirmedStudentPaymentDetails = ', this.confirmedStudentPaymentDetails);
   this.getData(this.confirmedStudentPaymentDetails);
  }


}
