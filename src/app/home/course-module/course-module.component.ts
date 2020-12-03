import {Component, ElementRef, ViewChild, OnInit, Inject} from '@angular/core';
import {FormBuilder, FormArray, FormGroup, Validators, FormControl} from '@angular/forms';
import {MatAutocomplete} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {DataService} from '../../_services/data.service';
import {AuthenticationService} from '../../_services/authentication.service';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Course, COURSES} from '../registration/registration.component';
import {YEARS} from '../../_services/shared.service';

export interface ResultData {
  module;
  results: [];
}

export interface ModuleData {
  moduleCode: string;
  moduleName: string;
  batch: number;
  description: string;
  credits: number;
  semester: number;
  disabled: boolean;
  teachers: Teacher[];
  lectureHours: LectureHour[];
  new: boolean;
}

export interface LectureHour {
  lectureHourID: number;
  moduleCode: string;
  type: string;
  startingTime: string;
  endingTime: string;
  day: number;
  lectureHall: string;
}

export interface Teacher {
  username: string;
  firstName: string;
  lastName: string;
}

export interface Results {
  moduleName: string;
  type: string;
  mark: number;
  date: Date;
}

export const DAYS_OF_WEEK: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// -----------------------------------------------------------------------------------------------------------------------------------------
// Module Component
// -----------------------------------------------------------------------------------------------------------------------------------------

@Component({
  selector: 'app-results',
  templateUrl: './course-module.component.html',
  styleUrls: ['./course-module.component.css']
})
export class CourseModuleComponent implements OnInit {

  constructor(
    private authentication: AuthenticationService
  ) {
  }

  ngOnInit() {
  }

  get getRole() {
    return this.authentication.details.role;
  }

}

// -----------------------------------------------------------------------------------------------------------------------------------------
// Delete Module Component
// -----------------------------------------------------------------------------------------------------------------------------------------

@Component({
  selector: 'app-delete-module-dialog',
  templateUrl: './delete-module-dialog.component.html',
  styleUrls: ['./course-module.component.css']
})

export class DeleteModuleDialogComponent implements OnInit {

  progress = false;
  error;

  constructor(
    public dataService: DataService,
    public dialogRef: MatDialogRef<DeleteModuleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModuleData
  ) {
  }

  ngOnInit() {
  }

  onNoClick() {
    this.dialogRef.close(false);
  }

  deleteModule() {
    this.progress = true;
    this.dataService.deleteModule({moduleCode: this.data.moduleCode}).subscribe(
      response => {
        if (response.status) {
          this.dialogRef.close(true);
        } else {
          this.error = response.message;
        }
      },
      error => this.error = error
    ).add(() => this.progress = false);
  }

}
