import {Component, OnInit} from '@angular/core';
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
  modules: Module[];
  results: Result[];
  calculatedResults: CalculatedResult[] = [];
  filteredResults: CalculatedResult[] = [];

  progress = false;

  constructor(
    private route: ActivatedRoute,
    private authentication: AuthenticationService,
    private data: DataService
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
      error => console.error(error)
    ).add(() => this.progress = false);
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
          allocation: mark.allocation,
          mark: mark.mark,
          grade: mark.grade
        });
      }
      this.calculatedResults.push(temp);
    }
    console.log(this.calculatedResults);
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

}
