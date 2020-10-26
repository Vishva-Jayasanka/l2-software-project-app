import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {EMPTY, Subject, Subscription} from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/operators';
import {DataService} from '../../../_services/data.service';
import {Exam} from '../upload-result/upload-result.component';
import {allocationValidator} from '../../../_validators/custom-validators.module';
import * as _ from 'lodash';
import {glow} from '../../../_services/shared.service';

@Component({
  selector: 'app-edit-result',
  templateUrl: './edit-result.component.html',
  styleUrls: ['./edit-result.component.css', '../results.component.css']
})
export class EditResultComponent implements OnInit, OnDestroy {

  YEARS = [2016, 2017, 2018, 2019, 2020];

  editResultsProgress = false;
  buttonProgress = false;
  moduleExists = false;
  success = false;
  examsNotFound = false;
  resultsNotFound = false;
  invalidAllocation = false;
  successfullyDeleted = false;

  roteParameter: string;
  moduleName: string;
  error: string;
  availableAllocation: string;

  editResultsForm: FormGroup;
  maxDate = new Date();
  exams: Exam[] = [];
  results = [];
  updatedResults = [];
  filteredResults = [];
  term$ = new Subject<string>();
  private searchSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private data: DataService,
    private elementRef: ElementRef
  ) {
    this.searchSubscription = this.term$.pipe(
      debounceTime(1000),
      switchMap(moduleCode => {
        this.checkModule(moduleCode);
        return EMPTY;
      })
    ).subscribe();
  }

  ngOnInit(): void {
    this.route.params.subscribe(param => {
      this.roteParameter = param.moduleCode;
    });
    this.editResultsForm = this.formBuilder.group({
      moduleCode: [this.roteParameter, [Validators.required, Validators.pattern(/^[A-Za-z]{2}[0-9]{4}/)]],
      batch: [{value: '', disabled: true}, [Validators.required]],
      exam: [{value: '', disabled: true}, [Validators.required]],
      type: [{value: '', disabled: true}, [Validators.required]],
      dateHeld: [{value: '', disabled: true}, [Validators.required]],
      allocation: [{value: '', disabled: true}, [Validators.required, Validators.pattern(/([0-9]{1,2})|(100)/)]],
      allocationAvailable: [''],
      hideMarks: [{value: true, disabled: true}]
    }, {validators: allocationValidator});
  }

  ngOnDestroy(): void {
    this.searchSubscription.unsubscribe();
  }

  checkModule(moduleCode: string) {
    this.batch.disable();
    this.exam.disable();
    this.error = '';
    this.success = false;
    this.moduleExists = false;
    this.examsNotFound = false;
    this.resultsNotFound = false;
    this.successfullyDeleted = false;
    if (moduleCode !== '') {
      this.data.checkIfModuleExists(moduleCode).subscribe(
        response => {
          response.status ? this.moduleName = '' : this.moduleName = response.moduleName;
          this.moduleExists = response.status;
          if (this.moduleName) {
            this.batch.enable();
            this.batch.reset();
            this.elementRef.nativeElement.querySelector('#edit_batch').focus();
          }
        },
        error => console.error(error)
      ).add(() => this.editResultsProgress = false);
    } else {
      this.editResultsProgress = false;
    }
  }

  getExams(batch: number) {
    this.error = '';
    this.success = false;
    this.editResultsProgress = true;
    this.resultsNotFound = false;
    this.exam.disable();
    this.data.getExamsOfModule(this.moduleCode.value, batch).subscribe(
      response => {
        this.exams = response.exams;
        this.availableAllocation = response.allocationAvailable;
        this.examsNotFound = this.exams.length === 0;
        if (!this.examsNotFound) {
          this.exam.reset();
          this.exam.enable();
          this.elementRef.nativeElement.querySelector('#edit_exam').focus();
        }
      },
      error => this.error = error
    ).add(() => this.editResultsProgress = false);
  }

  getResults() {
    if (this.results.length === 0 || confirm('are you sure you want to discard changes?')) {
      this.error = '';
      this.success = false;
      this.data.getResultsOfModule(this.exam.value).subscribe(
        response => {
          this.results = response.results;
          this.updatedResults = _.cloneDeep(this.results);
          this.filteredResults = this.updatedResults;
          this.resultsNotFound = this.results.length === 0;
          if (!this.resultsNotFound) {
            const selectedExam = this.exams.find(exam => exam.examID === this.exam.value);
            this.hideMarks.enable();
            this.type.enable();
            this.dateHeld.enable();
            this.allocation.enable();
            this.type.setValue(selectedExam.type);
            this.dateHeld.setValue(selectedExam.dateHeld);
            this.allocation.setValue(selectedExam.allocation);
            this.allocationAvailable.setValue(this.availableAllocation + selectedExam.allocation);
            this.hideMarks.setValue(selectedExam.hideMarks);
            this.elementRef.nativeElement.querySelector('#upload_preview').scrollIntoView({behavior: 'smooth'});
            glow(this.elementRef, 'upload_preview', 'rgb(100, 60, 180)');
          } else {
            this.type.disable();
            this.dateHeld.disable();
            this.allocation.disable();
            this.hideMarks.disable();
          }
        },
        error => {
          console.error(error);
        }
      );
    }
  }

  modifyResults() {
    this.editResultsProgress = true;
    this.buttonProgress = true;
    if (confirm('Are you sure you want save changes?')) {
      this.error = '';
      this.success = false;
      if (this.editResultsForm.valid) {
        const selected = {
          examID: parseInt(this.exam.value, 10),
          type: this.type.value,
          dateHeld: this.dateHeld.value,
          allocation: parseInt(this.allocation.value, 10),
          hideMarks: this.hideMarks.value,
          results: this.updatedResults
        };
        this.data.editResults(selected).subscribe(
          response => {
            this.results = _.cloneDeep(this.updatedResults);
            try {
              this.elementRef.nativeElement.querySelectorAll('[id^="result_"]').forEach(element => element.style.background = 'white');
            } catch (exception) {
            }
            this.success = true;
            this.elementRef.nativeElement.querySelector('#success_message').scrollIntoView({behavior: 'smooth'});
            glow(this.elementRef, 'upload_preview', 'rgb(100, 60, 180)');
            },
          error => {
            this.error = error;
            this.elementRef.nativeElement.querySelector('#error_message').scrollIntoView({behavior: 'smooth'});
            glow(this.elementRef, 'upload_preview', 'red');
          }
        ).add(() => {
          this.editResultsProgress = false;
          this.buttonProgress = false;
        });
      } else {
        this.scrollToFirstInvalidControl();
        this.editResultsProgress = false;
        this.buttonProgress = true;
      }
    } else {
      this.editResultsProgress = false;
      this.buttonProgress = true;
    }
  }

  deleteExam() {
    if (confirm('Are your sure you want delete this exam?\nAll results will also be deleted.')) {
      this.editResultsProgress = true;
      this.data.deleteExam(parseInt(this.exam.value, 10)).subscribe(
        response => {
          this.editResultsForm.reset();
          this.batch.disable();
          this.exam.disable();
          this.type.disable();
          this.dateHeld.disable();
          this.allocation.disable();
          this.hideMarks.disable();
          this.moduleName = '';
          this.results = [];
          this.successfullyDeleted = true;
        },
        error => console.log(error)
      ).add(() => setTimeout(() => this.editResultsProgress = false , 1000));
    }
  }

  onChange(i: number, value: string) {
    if (value === '') {
      this.elementRef.nativeElement.querySelector('#result_' + i).style.background = 'rgb(255,150,150)';
    } else {
      this.filteredResults[i].mark = parseInt(value, 10);
      this.elementRef.nativeElement
        .querySelector('#result_' + i).style.background = (this.filteredResults[i].mark !== this.results[i].mark) ? 'rgb(150,255,150)' : 'white';
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    if (filterValue) {
      this.filteredResults = this.updatedResults.filter(obj => obj.studentID.toLowerCase().includes(filterValue));
    } else {
      this.filteredResults = this.updatedResults;
    }
  }

  scrollToFirstInvalidControl() {
    const firstInvalidControl: HTMLElement = this.elementRef.nativeElement.querySelector('form .ng-invalid');
    firstInvalidControl.scrollIntoView({behavior: 'smooth'});
  }

  toggleProgress() {
    this.editResultsProgress = true;
  }

  get moduleCode() {
    return this.editResultsForm.get('moduleCode');
  }

  get batch() {
    return this.editResultsForm.get('batch');
  }

  get exam() {
    return this.editResultsForm.get('exam');
  }

  get type() {
    return this.editResultsForm.get('type');
  }

  get dateHeld() {
    return this.editResultsForm.get('dateHeld');
  }

  get allocation() {
    return this.editResultsForm.get('allocation');
  }

  get allocationAvailable() {
    return this.editResultsForm.get('allocationAvailable');
  }

  get hideMarks() {
    return this.editResultsForm.get('hideMarks');
  }

}
