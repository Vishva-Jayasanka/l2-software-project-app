import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {EMPTY, Subject, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {DataService} from '../../../_services/data.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {UserDataService} from '../../../_services/user-data.service';
import {AuthenticationService} from '../../../_services/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpEventType} from '@angular/common/http';

export interface RequestType {
  requestTypeID: number;
  request: string;
}

@Component({
  selector: 'app-add-request',
  templateUrl: './add-request.component.html',
  styleUrls: ['./add-request.component.css', '../request.component.css']
})
export class AddRequestComponent implements OnInit {

  uploadRequestProgress = false;
  deleteRequestProgress = false;
  imageUploadProgress: number;
  studentIDNotFound = false;
  success = false;

  error = '';

  requestForm: FormGroup;
  maxDate: Date = new Date();
  term$ = new Subject<string>();
  private searchSubscription: Subscription;

  requestTypes: RequestType[];
  documents: string[] = [];

  requestID: number;

  @ViewChild('fileUpload') fileUpload: ElementRef;
  @ViewChild('requestFormRef') requestFormRef;

  constructor(
    private formBuilder: FormBuilder,
    private data: DataService,
    private elementRef: ElementRef,
    private dialog: MatDialog,
    private userData: UserDataService,
    private authentication: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute
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

    this.route.params.subscribe(params => this.requestID = params.requestID);

  }

  ngOnInit(): void {

    this.requestForm = this.formBuilder.group({
      studentID: ['', [Validators.required, Validators.pattern(/^[0-9]{6}[A-Za-z]/)]],
      studentName: ['', [Validators.required]],
      course: ['', [Validators.required]],
      submissionDate: ['', [Validators.required]],
      request: ['', [Validators.required]],
      reasons: this.formBuilder.array([new FormControl('', [Validators.required])]),
      remarks: ['', [Validators.required]]
    });

    this.data.getRequestTypes().subscribe(
      response => {
        this.requestTypes = response.requestTypes;
      },
      error => this.error = error
    );

    this.uploadRequestProgress = true;
    if (this.requestID) {
      this.data.getRequestDetails(this.requestID).subscribe(
        response => {
          this.submissionDate.setValue(response.request[0].date);
          this.remarks.setValue(response.request[0].remarks);
          this.request.setValue(response.requestsMade.map(type => type.requestTypeID));
          this.reasons.controls = [];
          for (const reason of response.reasons) {
            this.reasons.push(new FormControl(reason.reason, [Validators.required]));
          }
        }, error => this.error = error
      ).add(() => this.uploadRequestProgress = false);
    } else {
      this.uploadRequestProgress = false;
    }

    if (this.getRole === 'Student') {
      this.userData.getUserDetails().subscribe(
        response => {
          this.studentName.setValue(response.details.fullName);
          this.course.setValue(response.details.courseName);
          this.studentID.setValue(response.details.username);
          this.uploadRequestProgress = false;
        }, error => {
          this.error = error;
        }
      );
    }

  }

  checkStudentID(studentID: string): void {
    this.success = false;
    this.error = '';
    this.studentIDNotFound = false;
    if (studentID) {
      this.data.checkStudentID(studentID).subscribe(
        response => {
          if (response.status) {
            this.studentName.setValue(response.name);
            this.course.setValue(response.course);
          } else {
            this.studentName.reset();
            this.course.reset();
            this.studentIDNotFound = true;
          }
        },
        error => {
          this.error = error;
        }
      ).add(() => this.uploadRequestProgress = false);
    } else {
      this.uploadRequestProgress = false;
    }
  }

  submitForm(): void {
    this.error = '';
    this.success = false;
    this.uploadRequestProgress = true;
    this.imageUploadProgress = 0;
    // if (this.requestForm.valid) {
    //   // if (this.documents.length > 0) {
    //   if (confirm('Are you sure you want to submit this form?')) {
    const data = this.requestForm.value;
    data.requestID = this.requestID;
    data.new = !this.requestID;
    data.documents = this.documents;
    this.data.uploadRequest(data).subscribe(
      response => {
        if (response.type === HttpEventType.DownloadProgress || response.type === HttpEventType.UploadProgress) {
          this.imageUploadProgress = Math.round(100 * response.loaded / response.total);
        } else if (response.type === HttpEventType.Response) {
          this.success = true;
          if (this.getRole === 'Admin') {
            this.reasons.controls = [new FormControl('', [Validators.required])];
            this.requestFormRef.resetForm();
            this.imageUploadProgress = 0;
            this.documents = [];
          } else {
            this.router.navigate(['../submitted-requests', {requestID: response.requestID}], {relativeTo: this.route});
          }
        }
      },
      error => {
        this.error = error;
      }
    ).add(() => this.uploadRequestProgress = false);
    // }
    // } else {
    //   this.uploadRequestProgress = false;
    //   glow(this.elementRef, 'documents', 'rgb(255,0,0)');
    //   setTimeout(() => {
    //     this.elementRef.nativeElement.querySelector('#documents').scrollIntoView({behavior: 'smooth'});
    //   }, 2000);
    // }
    // } else {
    //   this.uploadRequestProgress = false;
    //   scrollToFirstInvalidElement(this.elementRef);
    // }
  }

  resetForm(): void {
    this.elementRef.nativeElement.querySelector('#top').scrollIntoView({behavior: 'smooth'});
    this.ngOnInit();
  }

  onFileUpload(event: any): void {
    const uploadedImages = event.target.files;
    if (uploadedImages.length !== 0) {
      for (const image of uploadedImages) {
        const mimeType = image.type;
        if (mimeType.match(/image\/*/) == null) {
          console.log('File type not supported');
        } else {
          const reader = new FileReader();
          reader.readAsDataURL(image);
          reader.onload = () => {
            this.documents.push(reader.result as string);
          };
        }
      }
    } else {
      console.log('No files uploaded');
    }
  }

  deleteRequest(): void {
    if (confirm('Are you sure, you want to delete this request?')) {
      this.data.deleteRequests([this.requestID]).subscribe(
        response => {
          if (this.getRole === 'Admin') {
            this.router.navigate(['../submitted-requests', {requestDeleted: true}], {relativeTo: this.route});
          } else {
            this.router.navigate(['../submitted-requests', {requestDeleted: true}], {relativeTo: this.route});
          }
        },
        error => {
          this.error = error;
        }
      );
    }
  }

  openImagePreview(index: number) {
    this.dialog.open(ImagePreviewDialogComponent, {
      maxWidth: '90%',
      maxHeight: '650px',
      data: this.documents[index]
    });
  }

  clickFileUpload() {
    this.fileUpload.nativeElement.click();
  }

  removeImage(index: number): void {
    this.documents.splice(index, 1);
  }

  toggleProgress(): void {
    this.uploadRequestProgress = true;
  }

  addReason(): void {
    this.reasons.push(new FormControl('', [Validators.required]));
  }

  removeReason(i: number): void {
    this.reasons.controls.splice(i, i + 1);
  }

  get getRole(): string {
    return this.authentication.details.role;
  }

  get studentID(): AbstractControl {
    return this.requestForm.get('studentID');
  }

  get studentName(): AbstractControl {
    return this.requestForm.get('studentName');
  }

  get course(): AbstractControl {
    return this.requestForm.get('course');
  }

  get submissionDate(): AbstractControl {
    return this.requestForm.get('submissionDate');
  }

  get remarks(): AbstractControl {
    return this.requestForm.get('remarks');
  }

  get request(): AbstractControl {
    return this.requestForm.get('request');
  }

  get reasons(): FormArray {
    return this.requestForm.get('reasons') as FormArray;
  }

}

@Component({
  selector: 'app-image-preview-dialog',
  templateUrl: './image-preview-dialog.component.html',
  styleUrls: ['./add-request.component.css']
})

export class ImagePreviewDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ImagePreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public image: string
  ) {
  }

  ngOnInit() {
    console.log(this.image);
  }

}
