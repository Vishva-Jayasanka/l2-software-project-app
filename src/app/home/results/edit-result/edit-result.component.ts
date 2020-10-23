import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {EMPTY, Subject, Subscription} from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/operators';
import {DataService} from '../../../_services/data.service';
import {Exam} from '../upload-result/upload-result.component';
import {Results} from '../../course-module/course-module.component';

@Component({
  selector: 'app-edit-result',
  templateUrl: './edit-result.component.html',
  styleUrls: ['./edit-result.component.css', '../results.component.css']
})
export class EditResultComponent implements OnInit, OnDestroy {

  YEARS = [2016, 2017, 2018, 2019, 2020];

  editResultsProgress = false;
  moduleExists = false;
  success = false;

  roteParameter: string;
  moduleName: string;
  error: string;

  editResultsForm: FormGroup;
  maxDate = new Date();
  exams: Exam[] = [];
  results = [];
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
      type: [{value: '', disable: true}, [Validators.required]],
      dateHeld: [{value: '', disable: true}, [Validators.required]],
      allocation: [{value: '', disabled: true}, [Validators.required]],
      hideMarks: [{value: true, disabled: true}]
    });
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
    if (moduleCode !== '') {
      this.data.checkIfModuleExists(moduleCode).subscribe(
        response => {
          response.status ? this.moduleName = '' : this.moduleName = response.moduleName;
          this.moduleExists = response.status;
          if (this.moduleName) {
            this.batch.enable();
            this.batch.reset();
            this.elementRef.nativeElement.querySelector('#batch').focus();
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
    this.exam.disable();
    this.data.getExamsOfModule(this.moduleCode.value, batch).subscribe(
      response => {
        this.exams = response.exams;
        this.exam.reset();
        this.exam.enable();
        this.elementRef.nativeElement.querySelector('#exam').focus();
      },
      error => this.error = error
    ).add(() => this.editResultsProgress = false);
  }

  getResults() {
    this.data.getResultsOfModule(this.exam.value).subscribe(
      response => {
        this.results = response.results;
        this.hideMarks.enable();
        const selectedExam = this.exams.find(exam => exam.examID === this.exam.value);
        this.allocation.setValue(selectedExam.allocation);
        this.hideMarks.setValue(selectedExam.hideMarks);
      },
      error => {
        console.error(error);
      }
    );
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

  get hideMarks() {
    return this.editResultsForm.get('hideMarks');
  }

}
