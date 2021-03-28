import {Component, ElementRef, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DataService} from '../../../_services/data.service';
import {MatTableDataSource} from '@angular/material/table';

export interface PeriodicElement {
  no: number;
  regFee: number;
  slipNo: string;
  bank: string;
  date: string;
  paidAmount: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {no: 1, regFee: 6500, slipNo: 'Hydrogen', bank: '995240424V', date: 'onalisharindi@gmail.com', paidAmount: 206500.00},
  {no: 2, regFee: 6500, slipNo: 'Helium', bank: '995240424V', date: 'onalisharindi@gmail.com', paidAmount: 150000.00},
];

@Component({
  selector: 'app-view-payment',
  templateUrl: './view-payment.component.html',
  styleUrls: ['./view-payment.component.css']
})
export class ViewPaymentComponent implements OnInit {
  displayedColumns = ['no', 'regFee', 'slipNo', 'bank', 'date', 'paidAmount'];
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
