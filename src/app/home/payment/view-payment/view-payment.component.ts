import {Component, ElementRef, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DataService} from '../../../_services/data.service';
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
  selector: 'app-view-payment',
  templateUrl: './view-payment.component.html',
  styleUrls: ['./view-payment.component.css']
})
export class ViewPaymentComponent implements OnInit {
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
  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
  }
  ngOnInit(): void {

  }


}
