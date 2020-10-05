import {Component, ElementRef, ViewChild, OnInit, Inject} from '@angular/core';
import {FormBuilder, FormArray, FormGroup, Validators, FormControl} from '@angular/forms';
import {MatAutocomplete} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {DataService} from '../../_services/data.service';
import {AuthenticationService} from '../../_services/authentication.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Sort} from '@angular/material/sort';
import {ActivatedRoute} from '@angular/router';

export interface ResultData {
  module;
  results: [];
}

export interface ModuleData {
  moduleCode: string;
  moduleName: string;
  description: string;
  credits: number;
  semester: number;
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
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  modules = [];
  lectureHours = [];
  teachers = [];
  results = [];
  semesters = {};
  currentRegistration: string;
  progress = false;
  error = '';
  currentModules;
  routeParameter;

  constructor(
    public route: ActivatedRoute,
    public dialog: MatDialog,
    private data: DataService,
    private authentication: AuthenticationService
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.routeParameter = params;
    });
    this.currentRegistration = this.getCurrentLevel(this.authentication.details.currentRegistration);
    this.progress = true;
    this.getData();
  }

  getData() {
    this.data.getModules().subscribe(
      response => {
        this.modules = response.modules;
        this.lectureHours = response.lectureHours;
        this.teachers = response.teachers;
        this.results = response.results;
        this.getModules(this.modules, false);
      },
      error => {
        this.error = error;
      }
    ).add(
      () => {
        this.progress = false;
        if (!this.error) {
          setTimeout(() => {
            try {
              document.querySelector(`#${this.routeParameter.id.replace(' ', '')}`).scrollIntoView({behavior: 'smooth'});
            } catch (exeption) {
            }
          }, 200);
        }
      }
    );
  }

  getModules(modules, current) {
    for (let i = 0; i < 4; i++) {
      this.semesters[this.getCurrentLevel(i)] = this.modules.filter(module => (module.semester === i + 1));
    }
  }

  getLectureHours(moduleCode) {
    return this.lectureHours.filter(lectureHour => lectureHour.moduleCode === moduleCode);
  }

  getTeachers(moduleCode) {
    return this.teachers.filter(teacher => teacher.moduleCode === moduleCode);
  }

  getResults(moduleCode) {
    return this.results.filter(result => result.moduleCode === moduleCode)
      .sort((result1, result2) => (result1.date > result2.date) ? -1 : 1);
  }

  getCurrentLevel(val) {
    return 'Level ' + (Math.floor(val / 2) + 1) + ' Semester ' + (val % 2 + 1);
  }

  filter(checked) {
    this.getModules(this.modules, checked);
  }

  openResultsDialog(module): void {
    const dialogRef = this.dialog.open(ResultsDialogComponent, {
      width: '500px',
      data: {module, results: this.getResults(module.moduleCode)}
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }

  openAddNewModuleDialog(): void {
    const moduleData = {
      moduleCode: '',
      moduleName: '',
      credits: 2,
      description: '',
      semester: 1,
      teachers: [],
      lectureHours: [],
      new: true
    };
    const dialogRef = this.dialog.open(EditModuleDialogComponent, {
      width: '600px',
      minHeight: '400px',
      data: moduleData,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.getData();
      }
    });
  }

  openEditDetailsDialog(module: ModuleData): void {
    module.teachers = this.teachers.filter(teacher => teacher.moduleCode === module.moduleCode);
    module.lectureHours = this.lectureHours.filter(lectureHour => lectureHour.moduleCode === module.moduleCode);
    module.new = false;
    const dialogRef = this.dialog.open(EditModuleDialogComponent, {
      width: '600px',
      minHeight: '400px',
      data: module,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.getData();
      }
    });
  }

  openDeleteModuleDialog(module): void {
    const dialogRef = this.dialog.open(DeleteModuleDialogComponent, {
      width: '450px',
      data: module,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.getData();
      }
    });
  }

  get getRole() {
    return this.authentication.details.role;
  }

}

// -----------------------------------------------------------------------------------------------------------------------------------------
// View Results component
// -----------------------------------------------------------------------------------------------------------------------------------------

@Component({
  selector: 'app-results-dialog',
  templateUrl: './results-dialog.component.html',
  styleUrls: ['./results.component.css']
})

export class ResultsDialogComponent implements OnInit {

  results: Results[];
  sortedData: Results[];

  constructor(
    public dialogRef: MatDialogRef<ResultsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ResultData
  ) {
  }

  ngOnInit(): void {
    this.results = this.data.results;
    this.sortedData = this.results.slice();
  }

  sortData(sort: Sort) {
    const data = this.results.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }
    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'type' :
          return compare(a.type, b.type, isAsc);
        case 'mark' :
          return compare(a.mark, b.mark, isAsc);
        case 'date' :
          return compare(a.date, b.date, isAsc);
        default :
          return 0;
      }
    });

    function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getColor(val) {
    const red = (val < 50) ? 250 : 500 - val * 5;
    const green = (val < 50) ? val * 5 : 250;
    return 'rgb(' + red + ',' + green + ',' + '0)';
  }

}

// -----------------------------------------------------------------------------------------------------------------------------------------
// Add and Edit Module Component
// -----------------------------------------------------------------------------------------------------------------------------------------

@Component({
  selector: 'app-edit-module-dialog',
  templateUrl: './edit-module-dialog.component.html',
  styleUrls: ['./results.component.css']
})

export class EditModuleDialogComponent implements OnInit {

  selectable = true;
  removable = true;
  teacherCtrl = new FormControl();
  filteredTeachers: Observable<Teacher[]>;
  teachers: Teacher[] = [];
  allTeachers: Teacher[] = [];

  LECTURE_TYPES: string[] = ['Lecture', 'Lab Session', 'Tutorial'];
  LECTURE_HALLS: string[] = ['New Auditorium', 'Phase 1 Auditorium', 'L1H01', 'L2H02', 'Lab 1', 'Lab 2', 'Lab 3'];

  editModuleForm: FormGroup;
  progress = false;
  savingData = false;
  savingError = '';
  moduleExists = false;
  error = '';

  @ViewChild('teacherInput') teacherInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    private dataService: DataService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditModuleDialogComponent>,
    private elementRef: ElementRef,
    @Inject(MAT_DIALOG_DATA) public data: ModuleData
  ) {
  }

  ngOnInit() {
    this.progress = true;
    this.teachers = this.data.teachers;
    this.editModuleForm = this.formBuilder.group({
      moduleCode: [this.data.moduleCode, [Validators.required, Validators.pattern(/^[A-Za-z]{2}[0-9]{4}/)]],
      moduleName: [this.data.moduleName, [Validators.required, Validators.minLength(6)]],
      description: [this.data.description, [Validators.required, Validators.minLength(6)]],
      credits: [this.data.credits, [Validators.required, Validators.pattern(/^(([1-9])|([0-9]\.[1-9]))$/)]],
      semester: [this.data.semester.toString()],
      teacher: [''],
      lectureHours: this.formBuilder.array([]),
      newLectureHours: this.formBuilder.array([]),
      enabled: [false]
    });
    this.teacher.markAsTouched();
    for (const lectureHour of this.data.lectureHours) {
      this.lectureHours.push(this.newLectureHour(
        lectureHour.lectureHourID,
        lectureHour.moduleCode,
        lectureHour.type,
        lectureHour.day,
        lectureHour.lectureHall,
        lectureHour.startingTime,
        lectureHour.endingTime
      ));
    }
    this.dataService.getTeachers().subscribe(
      response => {
        this.allTeachers = response.teachers;
        this.filteredTeachers = this.editModuleForm.get('teacher').valueChanges.pipe(
          startWith(null),
          map((teacher: string | null) => teacher ? this._filter(teacher) : this.allTeachers.slice()));
      },
      error => this.error = error
    ).add(() => {
      this.progress = false;
    });
  }

  checkIfModuleExists(value) {
    this.dataService.checkIfModuleExists(value).subscribe(
      response => {
        if (this.data.new && !response) {
          this.moduleCode.setErrors({incorrect: false});
          this.moduleExists = true;
        }
      },
      error => console.error(error)
    );
  }

  addTeacher(): void {
    if (this.teacher.value) {
      const temp = this.allTeachers.find(teacher => teacher.username.toLowerCase() === this.teacher.value.toLowerCase());
      if (temp) {
        this.teachers.push(temp);
        this.teacher.setValue('');
      } else {
        this.teacher.setErrors({incorrect: true});
      }
    } else {
      this.teacher.setErrors({incorrect: true});
    }
  }

  removeTeacher(teacher: Teacher): void {
    const index = this.teachers.indexOf(teacher);
    if (index >= 0) {
      this.teachers.splice(index, 1);
    }
  }

  addNewLectureHour(): void {
    this.newLectureHours.push(this.newLectureHour(0, '', 'Lecture', 1, 'Lab 1', '08:15', '10:15'));
  }

  newLectureHour(lectureHourID: number,
                 moduleCode: string,
                 type: string,
                 day: number,
                 lectureHall: string,
                 startingTime: string,
                 endingTime: string
  ): FormGroup {
    return this.formBuilder.group({
      lectureHourID: [lectureHourID],
      moduleCode: [moduleCode],
      type: [type, Validators.required],
      day: [day, Validators.required],
      lectureHall: [lectureHall, Validators.required],
      startingTime: [startingTime, Validators.required],
      endingTime: [endingTime, Validators.required]
    });
  }

  removeLectureHour(index): void {
    this.lectureHours.removeAt(index);
  }

  removeNewLectureHour(index): void {
    this.newLectureHours.removeAt(index);
  }

  private _filter(value: string): Teacher[] {
    value = value.toLowerCase();
    return this.allTeachers.filter(teacher => teacher.username.toLowerCase().includes(value) ||
      (teacher.firstName + ' ' + teacher.lastName).toLowerCase().includes(value));
  }

  submitForm() {
    if (this.editModuleForm.valid) {
      if (this.teachers.length !== 0) {
        if (this.lectureHours.length !== 0 || this.newLectureHours.length !== 0) {
          const res = confirm('Are you sure you want to save changes?');
          if (res) {
            this.savingData = true;
            this.dataService.editModule({
              moduleDetails: this.editModuleForm.value,
              teachers: this.teachers,
              new: this.data.new
            }).subscribe(
              () => {
                this.dialogRef.close(true);
              },
              error => this.savingError = error
            ).add(() => this.savingData = false);
          }
        } else {
          this.elementRef.nativeElement.querySelector('#newLectureHours').scrollIntoView({behavior: 'smooth'});
        }
      } else {
        this.elementRef.nativeElement.querySelector('#selectTeacher').scrollIntoView({behavior: 'smooth'});
        this.teacher.setErrors({incorrect: true});
      }
    } else {
      this.editModuleForm.markAllAsTouched();
      this.scrollToFirstInvalidControl();
    }
  }

  scrollToFirstInvalidControl() {
    const firstInvalidControl: HTMLElement = this.elementRef.nativeElement.querySelector('form .ng-invalid');
    firstInvalidControl.scrollIntoView({behavior: 'smooth'});
  }

  checkbox() {
    if (this.enabled.value) {
      this.teacher.setErrors(null);
    }
  }

  onNoClick(): void {
    const response = confirm('Are you sure, you want to discard all changes?');
    if (response) {
      this.dialogRef.close(false);
    }
  }

  get moduleName() {
    return this.editModuleForm.get('moduleName');
  }

  get moduleCode() {
    return this.editModuleForm.get('moduleCode');
  }

  get credits() {
    return this.editModuleForm.get('credits');
  }

  get semester() {
    return this.editModuleForm.get('semester');
  }

  get description() {
    return this.editModuleForm.get('description');
  }

  get teacher() {
    return this.editModuleForm.get('teacher');
  }

  get lectureHours(): FormArray {
    return this.editModuleForm.get('lectureHours') as FormArray;
  }

  get newLectureHours(): FormArray {
    return this.editModuleForm.get('newLectureHours') as FormArray;
  }

  get enabled() {
    return this.editModuleForm.get('enabled');
  }

  get daysOfWeek() {
    return DAYS_OF_WEEK;
  }

}


// -----------------------------------------------------------------------------------------------------------------------------------------
// Delete Module Component
// -----------------------------------------------------------------------------------------------------------------------------------------

@Component({
  selector: 'app-delete-module-dialog',
  templateUrl: './delete-module-dialog.component.html',
  styleUrls: ['./results.component.css']
})

export class DeleteModuleDialogComponent implements OnInit {

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
    this.dataService.deleteModule({moduleCode: this.data.moduleCode}).subscribe(
      response => console.log(response),
      error => console.error(error)
    );
  }

}
