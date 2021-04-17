import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup} from '@angular/forms';
import {DataService} from '../../../../_services/data.service';
import {MatTableDataSource} from '@angular/material/table';


export interface PeriodicElement {
  no: number;
  slipNo: string;
  bank: string;
  date: string;
  paidAmount: number;
}

@Component({
  selector: 'app-view-payments',
  templateUrl: './view-payments.component.html',
  styleUrls: ['./view-payments.component.css']
})

export class ViewPaymentsComponents implements OnInit {
  @Input('confirmedStudentPaymentDetails') confirmedStudentPaymentDetails;
  displayedColumns = ['no', 'slipNo', 'bank', 'date', 'paidAmount'];
  dataSource = new MatTableDataSource([]);
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
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {
   console.log('confirmedStudentPaymentDetails = ', this.confirmedStudentPaymentDetails);
   this.getData(this.confirmedStudentPaymentDetails);
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
