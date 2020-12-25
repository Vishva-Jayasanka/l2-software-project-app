import {Component, ElementRef, ViewChild, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DataService} from '../../../_services/data.service';
import {EMPTY, Subject, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, switchMap} from 'rxjs/operators';
import {COMMA, ENTER, TAB} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {YEARS} from '../../../_services/shared.service';

export interface Student {
  studentID: string;
  firstName: string;
  lastName: string;
}

export interface Module {
  moduleCode: string;
  moduleName: string;
}

@Component({
  selector: 'app-enroll',
  templateUrl: './enroll.component.html',
  styleUrls: ['./enroll.component.css', '../course-module.component.css']
})
export class EnrollComponent implements OnInit {

  enrollProgress = false;
  studentIDNotFound = false;
  success = false;

  academicYears = YEARS;

  error = '';
  separatorKeysCodes = [ENTER, COMMA, TAB];

  enrollmentForm: FormGroup;
  term$ = new Subject<string>();
  private searchSubscription: Subscription;

  filteredModules: Observable<Module[]>;
  modules: Module[] = [];
  allModules: Module[] = [
    {moduleCode: 'IN5101', moduleName: 'Object Oriented Programming'},
    {moduleCode: 'IN5110', moduleName: 'Distributed Systems and Networking'},
    {moduleCode: 'IN5210', moduleName: 'Programming and Program Design'}
  ];

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    private formBuilder: FormBuilder,
    private data: DataService
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

    this.enrollmentForm = this.formBuilder.group({
      studentID: ['', [Validators.required, Validators.pattern(/^[0-9]{6}[A-Za-z]$/)]],
      studentName: ['', Validators.required],
      course: ['', Validators.required],
      semester: ['', Validators.required],
      academicYear: ['', Validators.required],
      inputModule: ['']
    });

    this.filteredModules = this.inputModule.valueChanges.pipe(
      startWith(null),
      map((module: string | null) => module ? this._filter(module) : this.allModules.slice())
    );

  }

  ngOnInit(): void {
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.modules.push(this.allModules.find(
        module => module.moduleCode.toLowerCase() === value.toLowerCase() || module.moduleName.toLowerCase() === value.toLowerCase())
      );
    }

    if (input) {
      input.value = '';
    }

    this.inputModule.setValue(null);
  }

  remove(module: Module): void {
    const index = this.modules.indexOf(module);

    if (index >= 0) {
      this.modules.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.modules.push(this.allModules.find(module => module.moduleCode === event.option.value));
    this.fruitInput.nativeElement.value = '';
    this.inputModule.setValue(null);
  }

  private _filter(value: string): Module[] {
    const filterValue = value.toLowerCase();
    return this.allModules.filter(
      module => module.moduleName.toLowerCase().includes(filterValue) || module.moduleCode.toLowerCase().includes(filterValue)
    );
  }

  checkStudentID(studentID: string) {
    if (studentID) {
      this.data.checkStudentID(studentID).subscribe(
        response => {
          if (response.status) {
            this.studentName.setValue(response.name);
            this.course.setValue(response.course);
          } else {
            this.studentName.setValue('');
            this.course.setValue('');
            this.studentIDNotFound = true;
          }
        },
        error => this.error = error
      ).add(() => this.enrollProgress = false);
    } else {
      this.enrollProgress = false;
    }
  }

  resetForm() {
    this.enrollmentForm.reset();
    setTimeout(() => this.enrollProgress = false, 200);
    this.modules = [];
  }

  submitForm() {
    console.log(this.enrollmentForm.value);
  }

  toggleProgress() {
    this.enrollProgress = true;
  }

  get studentID() {
    return this.enrollmentForm.get('studentID');
  }

  get studentName() {
    return this.enrollmentForm.get('studentName');
  }

  get course() {
    return this.enrollmentForm.get('course');
  }

  get semester() {
    return this.enrollmentForm.get('semester');
  }

  get academicYear() {
    return this.enrollmentForm.get('academicYear');
  }

  get inputModule() {
    return this.enrollmentForm.get('inputModule');
  }

}
