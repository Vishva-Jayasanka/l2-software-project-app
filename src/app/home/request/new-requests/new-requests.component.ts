import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormControl} from '@angular/forms';
import {DataService} from '../../../_services/data.service';
import {MatTabChangeEvent} from '@angular/material/tabs';

export interface Request {
  requestID: number;
  submittedBy: string;
  date: Date;
  finalDecision: number;
  status: number;
  requests: string;
  dateSubmitted: Date;
}

@Component({
  selector: 'app-new-requests',
  templateUrl: './new-requests.component.html',
  styleUrls: ['./new-requests.component.css']
})
export class NewRequestsComponent implements OnInit, AfterViewInit {

  error = '';
  progress = false;

  allRequests: Request[];
  displayedColumns: string[] = ['select', 'position', 'studentID', 'requests', 'dateSubmitted', 'details'];
  dataSource: MatTableDataSource<Request> = new MatTableDataSource<Request>([]);
  selection = new SelectionModel<Request>(true, []);

  filter: FormControl = new FormControl('');

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tabGroup') tabGroup;

  constructor(
    private snackBar: MatSnackBar,
    private data: DataService
  ) {
    this.filter.valueChanges.subscribe(value => this.applyFilter(value));
  }

  ngOnInit(): void {
    this.progress = true;
    this.data.getAllRequests().subscribe(
      response => {
        this.allRequests = response.requests;
        this.filterData(0);
        this.ngAfterViewInit();
      }, error => {
        this.error = error;
      }
    ).add(() => this.progress = false);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  viewDetails(index: number): void {
    console.log(index);
  }

  filterData(value: number | MatTabChangeEvent): void {
    const index = value instanceof MatTabChangeEvent ? value.index : value;
    this.dataSource = new MatTableDataSource<Request>(this.allRequests.filter(request => request.status === index));
    this.ngAfterViewInit();
  }

  deleteItems(): void {
    if (confirm('Are you sure, you want to delete selected items?')) {
      this.selection.selected.forEach(item => {
        this.allRequests.splice(this.allRequests.indexOf(item), 1);
        this.filterData(this.tabGroup.selectedIndex);
        this.selection.clear();
      });
      this.snackBar.open('Items deleted successfully', 'Close', {duration: 3000});
    }
  }

  applyFilter(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: Request): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.submittedBy + 1}`;
  }

}
