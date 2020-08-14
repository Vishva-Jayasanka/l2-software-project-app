import {Component, ElementRef, ViewChild, OnInit, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl, AbstractControl} from '@angular/forms';
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
}

export interface LectureHour {
  moduleCode: string;
  type: string;
  startingTime: number;
  endingTime: number;
  day: string;
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
    this.data.getModules().subscribe(
      response => {
        this.modules = response.modules;
        this.currentModules = new Set(response.currentModules);
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
      this.semesters[this.getCurrentLevel(i)] = this.modules.filter(module => (module.semester === i + 1) &&
        (this.currentModules.has(module.moduleCode) || !current));
    }
  }

  getResults(moduleCode) {
    return this.results.filter(result => result.moduleCode === moduleCode)
      .sort((result1, result2) => (result1.date > result2.date) ? -1 : 1);
  }

  getCurrentLevel(val) {
    return 'Level ' + (Math.floor(val / 2) + 1) + ' Semester ' + (val % 2 + 1);
  }

  getTime(time) {
    const hours = Math.floor(time / 60);
    const minutes = time % 60;
    return ((hours < 10) ? '0' : '') + hours + ':' + ((minutes < 10) ? '0' : '') + minutes;
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

  openEditDetailsDialog(module): void {
    const dialogRef = this.dialog.open(EditModuleDialogComponent, {
      width: '500px',
      minHeight: '400px',
      data: module,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        const index = this.modules.indexOf(module);
        this.modules[index] = response;
        this.getModules(this.modules, false);
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
// Module Edit component
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
  oldCode: string;

  lectureHours: LectureHour[];
  TYPES: string[] = ['Lecture', 'Lab Session', 'Tutorial'];
  DAYS_OF_WEEK: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  LECTURE_HALLS: string[] = ['Phase 1 Auditorium', 'Phase 2 Auditorium', 'Lab 1', 'Lab 2', '2LH01', '2LH03'];

  controls: Map<string, AbstractControl>;

  editModuleForm: FormGroup;
  progress = false;
  error = '';

  @ViewChild('teacherInput') teacherInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    private dataService: DataService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditModuleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModuleData
  ) {
  }

  ngOnInit() {
    this.progress = true;
    this.teachers = JSON.parse(JSON.stringify(this.data.teachers));
    this.lectureHours = JSON.parse(JSON.stringify(this.data.lectureHours));
    this.oldCode = this.data.moduleCode;
    this.editModuleForm = this.formBuilder.group({
      moduleCode: [this.data.moduleCode, [Validators.required, Validators.pattern(/^[A-Za-z]{2}\s[0-9]{4}/)]],
      moduleName: [this.data.moduleName, [Validators.required, Validators.minLength(6)]],
      description: [this.data.description, [Validators.required, Validators.minLength(6)]],
      credits: [this.data.credits, [Validators.required, Validators.pattern(/^(([1-9])|([0-9]\.[1-9]))$/)]],
      semester: [this.data.semester.toString()],
      teacher: [''],
      type: [''],
      day: [''],
      lectureHall: [''],
      startingTime: [''],
      endingTime: [''],
      enabled: [false]
    });
    this.controls = new Map([
      ['type', this.type],
      ['startingTime', this.startingTime],
      ['endingTime', this.endingTime],
      ['day', this.day],
      ['lectureHall', this.lectureHall]
    ]);
    this.teacher.markAsTouched();
    this.controls.forEach((control: AbstractControl) => control.markAsTouched());
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

  addLecture(): void {
    let allValid = true;
    console.log(this.editModuleForm.value);
    const temp: LectureHour = {moduleCode: '', type: '', startingTime: 0, endingTime: 0, day: '', lectureHall: ''};
    this.controls.forEach((control: AbstractControl, key: string) => {
      if (control.value !== '') {
        temp[key] = (key === 'startingTime' || key === 'endingTime') ? this.convertTime(control.value) : control.value;
      } else {
        control.setErrors({incorrect: true});
        allValid = false;
      }
    });
    if (allValid) {
      this.controls.forEach((value: AbstractControl) => value.setValue(''));
      this.lectureHours.push(temp);
      console.log(temp);
    }
  }

  removeTeacher(teacher: Teacher): void {
    const index = this.teachers.indexOf(teacher);
    if (index >= 0) {
      this.teachers.splice(index, 1);
    }
  }

  removeLectureHour(lectureHour: LectureHour): void {
    const index = this.lectureHours.indexOf(lectureHour);
    if (index >= 0) {
      this.lectureHours.splice(index, 1);
    }
  }

  convertTime(value) {
    const time = value.split(':');
    return parseInt(time[0], 10) * 60 + parseInt(time[1], 10);
  }

  private _filter(value: string): Teacher[] {
    value = value.toLowerCase();
    return this.allTeachers.filter(teacher => teacher.username.toLowerCase().includes(value) ||
      (teacher.firstName + ' ' + teacher.lastName).toLowerCase().includes(value));
  }

  submitForm() {
    if (this.editModuleForm.invalid) {
      document.querySelector(`#form`).scrollIntoView({behavior: 'smooth'});
    } else {
      if (!this.enabled.value && this.teachers.length === 0) {
        document.querySelector(`#teachers`).scrollIntoView({behavior: 'smooth'});
        this.teacher.setErrors({required: true});
      } else {
        if (!this.enabled.value && this.lectureHours.length === 0) {
          document.querySelector(`#lectureHours`).scrollIntoView({behavior: 'smooth'});
          this.controls.forEach((value: AbstractControl) => value.setErrors({incorrect: true}));
        } else {
          this.data = {
            moduleName: this.moduleName.value,
            moduleCode: this.moduleCode.value,
            credits: parseInt(this.credits.value, 10),
            semester: parseInt(this.semester.value, 10),
            description: this.description.value,
            teachers: this.teachers,
            lectureHours: this.lectureHours
          };
          const res = confirm('Are you sure, you want to save change?');
          if (res) {
            this.dataService.editModule({moduleCode: this.oldCode, data: this.data}).subscribe(
              response => {
                console.log(response);
                // this.dialogRef.close(this.data);
              },
              error => {
                console.error(error);
              });
          }
        }
      }
    }
  }

  checkbox() {
    if (this.enabled.value) {
      this.teacher.setErrors(null);
      this.controls.forEach((control: AbstractControl) => control.setErrors(null));
    }
  }

  onNoClick(): void {
    const response = confirm('Are you sure, you want to discard all changes?');
    if (response) {
      this.dialogRef.close(null);
    }
  }

  getTime(value: number) {
    const hours = Math.floor(value / 60);
    const minutes = value % 60;
    return (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;
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

  get type() {
    return this.editModuleForm.get('type');
  }

  get day() {
    return this.editModuleForm.get('day');
  }

  get lectureHall() {
    return this.editModuleForm.get('lectureHall');
  }

  get startingTime() {
    return this.editModuleForm.get('startingTime');
  }

  get endingTime() {
    return this.editModuleForm.get('endingTime');
  }

  get enabled() {
    return this.editModuleForm.get('enabled');
  }

}
