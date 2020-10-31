import {Component, ElementRef, ViewChild, OnInit, Inject} from '@angular/core';
import {FormBuilder, FormArray, FormGroup, Validators, FormControl} from '@angular/forms';
import {MatAutocomplete} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {DataService} from '../../_services/data.service';
import {AuthenticationService} from '../../_services/authentication.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {Course, COURSES} from '../registration/registration.component';
import {YEARS} from '../../_services/shared.service';

export interface ResultData {
  module;
  results: [];
}

export interface ModuleData {
  moduleCode: string;
  moduleName: string;
  moduleYear: number;
  year: number;
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

  modules = [];
  lectureHours = [];
  teachers = [];
  semesters = {};
  currentRegistration: string;
  progress = false;
  error = '';
  currentModules;
  routeParameter;

  courseName = '';

  constructor(
    public route: ActivatedRoute,
    public router: Router,
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
    const route = (this.getRole === 'teacher') ? this.data.getAssignments() : this.data.getModules();
    route.subscribe(
      response => {
        this.modules = response.modules;
        this.lectureHours = response.lectureHours;
        this.teachers = response.teachers;
        this.courseName = response.course || '';
        this.getModules();
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
              document.querySelector(`#${this.routeParameter.moduleCode}`).scrollIntoView({behavior: 'smooth'});
            } catch (exeption) {
            }
          }, 200);
        }
      }
    );
  }

  getModules() {
    for (let i = 0; i < 4; i++) {
      const semester = [];
      for (const module of this.modules.filter(m => m.semester === i + 1)) {
        const tempModule: ModuleData = {
          moduleCode: module.moduleCode,
          moduleName: module.moduleName,
          moduleYear: module.moduleYear,
          year: module.year,
          description: module.description,
          credits: module.credits,
          semester: module.semester,
          disabled: module.disabled,
          teachers: this.getTeachers(module.moduleCode),
          lectureHours: this.getLectureHours(module.moduleCode),
          new: false
        };
        semester.push(tempModule);
      }
      this.semesters[this.getCurrentLevel(i)] = semester;
    }
  }

  getTeachers(moduleCode: string): Teacher[] {
    return this.teachers.filter(teacher => teacher.moduleCode === moduleCode);
  }

  getLectureHours(moduleCode): LectureHour[] {
    return this.lectureHours.filter(lectureHour => lectureHour.moduleCode === moduleCode);
  }

  getCurrentLevel(val) {
    return 'Level ' + (Math.floor(val / 2) + 1) + ' Semester ' + (val % 2 + 1);
  }

  openAddNewModuleDialog(): void {
    const moduleData = {
      moduleCode: '',
      moduleName: '',
      moduleYear: 0,
      year: 0,
      credits: null,
      description: '',
      semester: 1,
      disabled: false,
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

  get daysOfWeek() {
    return DAYS_OF_WEEK;
  }

}

// -----------------------------------------------------------------------------------------------------------------------------------------
// Add and Edit Module Component
// -----------------------------------------------------------------------------------------------------------------------------------------

@Component({
  selector: 'app-edit-module-dialog',
  templateUrl: './edit-module-dialog.component.html',
  styleUrls: ['./course-module.component.css']
})

export class EditModuleDialogComponent implements OnInit {

  selectable = true;
  removable = true;
  teacherCtrl = new FormControl();
  filteredTeachers: Observable<Teacher[]>;
  teachers: Teacher[] = [];
  allTeachers: Teacher[] = [];
  courses: Course[] = COURSES;
  years = YEARS;

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
      batch: [this.data.moduleYear, [Validators.required]],
      description: [this.data.description, [Validators.required, Validators.minLength(6)]],
      credits: [this.data.credits, [Validators.required, Validators.pattern(/^(([1-9])|([0-9]\.[1-9]))$/)]],
      semester: [this.data.semester.toString()],
      teacher: [''],
      lectureHours: this.formBuilder.array([]),
      newLectureHours: this.formBuilder.array([]),
      disabled: [this.data.disabled]
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
        if (this.data.new && !response.status) {
          this.moduleCode.setErrors({incorrect: false});
          this.moduleExists = true;
        }
      },
      error => this.error = error
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
    if (this.disabled.value) {
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

  get batch() {
    return this.editModuleForm.get('batch');
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

  get disabled() {
    return this.editModuleForm.get('disabled');
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
