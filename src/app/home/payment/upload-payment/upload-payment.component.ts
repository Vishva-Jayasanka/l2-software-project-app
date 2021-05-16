import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DataService} from '../../../_services/data.service';
import {EMPTY, Subject, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {AuthenticationService} from 'src/app/_services/authentication.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ConfirmUploadDialogComponent} from '../payment.component';
import { HttpClient } from '@angular/common/http';
import {ImageCroppedEvent} from 'ngx-image-cropper';

export interface Bank {
  bankID: number;
  bankName: string;
}

@Component({
  selector: 'app-upload-payment',
  templateUrl: './upload-payment.component.html',
  styleUrls: ['./upload-payment.component.css']
})
export class UploadPaymentComponent implements OnInit {
  @ViewChild('fileUpload') fileUploadClick: ElementRef;
  uploadAPaymentProgress = false;
  studentIDNotFound = false;
  success = false;
  fileName = '';
  requiredFileType="image/png";
  imageChangedEvent: any = '';
  uploadedImageBase64: any = '';

  error = '';

  banks: Bank[] = [
    {bankID: 1, bankName: 'BOC'},
    {bankID: 2, bankName: 'Peoples Bank'}
  ];

  paymentForm: FormGroup;
  term$ = new Subject<string>();
  private searchSubscription: Subscription;


  constructor(
    private formBuilder: FormBuilder,
    private data: DataService,
    private elementRef: ElementRef,
    private authentication: AuthenticationService,
    public dialog: MatDialog,
    private http: HttpClient,
    // @Inject(MAT_DIALOG_DATA) public userData
  ) {
    this.searchSubscription = this.term$.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap(studentID => {
        this.error = '';
        this.success = false;
        this.studentIDNotFound = false;
        this.checkStudentID(studentID);
        return EMPTY;
      })
    ).subscribe();
  }

  ngOnInit(): void {
    this.paymentForm = this.formBuilder.group({
        depositor: this.formBuilder.group({
          registrationNumber: ['', [Validators.required, Validators.pattern(/^([0-9]{6}[A-Za-z])$/)]],
          fullName: [''],
          course: [''],
          academicYear: [''],
        }),
        deposit: this.formBuilder.group({
          bankName: ['', [Validators.required]],
          slipNumber: ['', [Validators.required]],
          externalNote: [''],
          totalPaid: ['', [Validators.required]],
          paymentDate: ['', [Validators.required]],
        }),
      }
    );
    if (this.getRole == 'Student') {
      this.getUseDetails();
      this.toggleProgress();
    }
  }


  submitForm() {
    this.uploadAPaymentProgress = true;
    this.error = '';
    this.success = false;
    if (this.paymentForm.valid) {
      this.data.uploadPayment(this.paymentForm.value, this.getRole,this.uploadedImageBase64).subscribe(
        response => {
          if (response.status) {
            this.openDialog();
          }
          this.success = true;
          this.paymentForm.reset();
        },
        error => {
          this.success = false;
          this.error = error;
        }
      ).add(() => this.uploadAPaymentProgress = false);
    } else {
      this.uploadAPaymentProgress = false;
      this.scrollToFirstInvalidControl();
    }
  }

  scrollToFirstInvalidControl() {
    const firstInvalidControl: HTMLElement = this.elementRef.nativeElement.querySelector('form .ng-invalid');
    firstInvalidControl.scrollIntoView({behavior: 'smooth'});
  }

  checkStudentID(studentID) {
    this.success = false;
    this.error = '';
    this.studentIDNotFound = false;
    if (studentID) {
      this.data.checkStudentID(studentID).subscribe(
        response => {
          if (response.status) {
            this.fullName.setValue(response.name);
            this.academicYear.setValue(response.academicYear);
            this.course.setValue(response.course);
          } else {
            this.studentIDNotFound = true;
          }
        },
        error => this.error = error
      ).add(() => this.uploadAPaymentProgress = false);
    } else {
      this.uploadAPaymentProgress = false;
    }
  }

  get getRole() {
    return this.authentication.details.role;
  }

  getUseDetails() {
    this.registrationNumber.setValue(this.authentication.details.username);
    this.checkStudentID(this.authentication.details.username);
  }

  clickFileUpload() {
    this.fileUploadClick.nativeElement.click();
  }


  toggleProgress() {
    this.uploadAPaymentProgress = true;
  }

  get fullName() {
    return this.paymentForm.get('depositor').get('fullName');
  }

  get course() {
    return this.paymentForm.get('depositor').get('course');
  }

  get academicYear() {
    return this.paymentForm.get('depositor').get('academicYear');
  }

  get registrationNumber() {
    return this.paymentForm.get('depositor').get('registrationNumber');
  }

  get bankName() {
    return this.paymentForm.get('deposit').get('bankName');
  }

  get slipNumber() {
    return this.paymentForm.get('deposit').get('slipNumber');
  }

  get externalNote() {
    return this.paymentForm.get('deposit').get('externalNote');
  }

  get totalPaid() {
    return this.paymentForm.get('deposit').get('totalPaid');
  }

  get paymentDate() {
    return this.paymentForm.get('deposit').get('paymentDate');
  }

  resetForm() {
    this.bankName.setValue(null);
    this.slipNumber.setValue(null);
    this.externalNote.setValue(null);
    this.totalPaid.setValue(null);
    this.paymentDate.setValue(null);
    this.fileName=null;
    
    this.elementRef.nativeElement.querySelector('#course-name').scrollIntoView();
  }

  openDialog() {
    const dialogRef = this.dialog.open(ConfirmUploadDialogComponent, {
      width: '450px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
      }
    });
  }

  onFileSelected(event) {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.uploadedImageBase64 = event.base64;
  }

}
