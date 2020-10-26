import {Component, ElementRef, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AuthenticationService} from '../../_services/authentication.service';
import {DataService} from '../../_services/data.service';

export interface Module {
  moduleCode: string;
  moduleName: string;
  batch: number;
  grade: string;
}

export interface Result {
  moduleCode: string;
  type: string;
  dateHeld: Date;
  allocation: number;
  batch: number;
  grade: string;
  mark: number;
}

export interface CalculatedResult {
  moduleCode: string;
  moduleName: string;
  batch: number;
  grade: string;
  marks: {
    type: string;
    dateHeld: Date;
    allocation: number;
    mark: number;
    grade: string;
  }[];
}

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  moduleCode: string;
  resultsError = '';
  modules: Module[];
  results: Result[];
  calculatedResults: CalculatedResult[] = [];
  filteredResults: CalculatedResult[] = [];

  progress = false;

  constructor(
    private route: ActivatedRoute,
    private authentication: AuthenticationService,
    private data: DataService,
    private elementRef: ElementRef
  ) {
  }

  ngOnInit(): void {
    this.progress = true;
    this.route.params.subscribe(params => {
      this.moduleCode = params.moduleCode;
    });
    this.data.getExamResults().subscribe(
      response => {
        this.modules = response.modules;
        this.results = response.results;
        this.getResults();
      },
      error => this.resultsError = error
    ).add(() => {
      this.progress = false;
      setTimeout(() => {
        try {
          this.elementRef.nativeElement.querySelector('#collapse' + this.moduleCode).scrollIntoView({behavior: 'smooth'});
        } catch (exception) {
        }
      }, 500);
    });
  }

  getResults() {
    for (const module of this.modules) {
      const temp: CalculatedResult = {
        moduleCode: module.moduleCode,
        moduleName: module.moduleName,
        batch: module.batch,
        grade: module.grade,
        marks: []
      };
      for (const mark of this.results.filter(result => result.moduleCode === module.moduleCode && result.batch === module.batch)) {
        temp.marks.push({
          type: mark.type,
          dateHeld: new Date(mark.dateHeld),
          allocation: mark.allocation,
          mark: mark.mark,
          grade: mark.grade
        });
      }
      temp.marks.sort((result1, result2) => result1.dateHeld > result2.dateHeld ? 1 : -1);
      this.calculatedResults.push(temp);
    }
    this.filteredResults = this.calculatedResults;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    if (filterValue) {
      this.filteredResults = this.calculatedResults.filter(
        obj => obj.moduleCode.toLowerCase().includes(filterValue) || obj.moduleName.toLowerCase().includes(filterValue)
      );
    } else {
      this.filteredResults = this.calculatedResults;
    }
  }

  get getRole() {
    return this.authentication.details.role;
  }

  getColor(val: number) {
    const red = (val < 50) ? 250 : 500 - val * 5;
    const green = (val < 50) ? val * 5 : 250;
    return 'rgb(' + red + ',' + green + ',' + '0)';
  }

  getColorGrade(val: string, opacity: boolean) {
    let temp;
    switch (val) {
      case 'A+' : temp = 'rgba(0, 255, 0, 0.2)'; break;
      case 'A' : temp =  'rgba(37, 255, 0, 0.2)'; break;
      case 'A-' : temp =  'rgba(74, 255, 0, 0.2)'; break;
      case 'B+' : temp =  'rgba(111, 255, 0, 0.2)'; break;
      case 'B' : temp =  'rgba(147, 255, 0, 0.2)'; break;
      case 'B-' : temp =  'rgba(183, 255, 0, 0.2)'; break;
      case 'C+' : temp =  'rgba(220, 255, 0, 0.2)'; break;
      case 'C' : temp =  'rgba(255, 255, 0, 0.2)'; break;
      case 'C-' : temp =  'rgba(255, 220, 0, 0.2)'; break;
      case 'D+' : temp =  'rgba(255, 183, 0, 0.2)'; break;
      case 'D' : temp =  'rgba(255, 147, 0, 0.2)'; break;
      case 'D-' : temp =  'rgba(255, 111, 0, 0.2)'; break;
      case 'F+' : temp =  'rgba(255, 74, 0, 0.2)'; break;
      case 'F' : temp =  'rgba(255, 37, 0, 0.2)'; break;
      case 'F-' : temp =  'rgba(255, 0, 0, 0.2)'; break;
    }
    if (opacity) {
      return temp.replace(/, 0.2/, '');
    }
    return temp;
  }

}
