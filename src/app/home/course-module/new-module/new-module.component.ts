import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {Course, COURSES} from '../../registration/registration.component';
import {YEARS} from '../../../_services/shared.service';
import {MatAutocomplete} from '@angular/material/autocomplete';
import {DataService} from '../../../_services/data.service';
import {map, startWith} from 'rxjs/operators';
import {DAYS_OF_WEEK, ModuleData, Teacher} from '../course-module.component';
import {ActivatedRoute, Route, Router} from '@angular/router';

@Component({
  selector: 'app-new-module',
  templateUrl: './new-module.component.html',
  styleUrls: ['./new-module.component.css']
})
export class NewModuleComponent implements OnInit {

  selectable = true;
  removable = true;

  routeParameter: string;

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

  data: ModuleData = {
    moduleCode: '',
    moduleName: '',
    batch: 0,
    description: '',
    credits: 0,
    semester: 0,
    disabled: false,
    teachers: [],
    lectureHours: [],
    new: true
  };

  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    private dataService: DataService,
    private formBuilder: FormBuilder,
    private elementRef: ElementRef,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.progress = true;
    this.route.params.subscribe(params => this.routeParameter = params.moduleCode);
    if (this.routeParameter) {
      this.dataService.getModuleDetails(this.routeParameter).subscribe(
        response => {
          this.data = response.moduleDetails;
          this.data.teachers = response.teachers;
          this.data.lectureHours = response.lectureHours;
          this.data.new = false;
          console.log(this.data);
        },
        error => console.log(error)
      ).add(() => this.getModule());
    } else {
      this.getModule();
    }
  }

  getModule() {
    this.teachers = this.data.teachers;
    this.editModuleForm = this.formBuilder.group({
      moduleCode: [this.data.moduleCode, [Validators.required, Validators.pattern(/^[A-Za-z]{2}[0-9]{4}/)]],
      moduleName: [this.data.moduleName, [Validators.required, Validators.minLength(6)]],
      batch: [this.data.batch, [Validators.required]],
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
                this.router.navigate(['course-modules/module-details', {moduleCode: this.moduleCode.value}]);
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

  get moduleCode() {
    return this.editModuleForm.get('moduleCode');
  }

  get moduleName() {
    return this.editModuleForm.get('moduleName');
  }

  get batch() {
    return this.editModuleForm.get('batch');
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
