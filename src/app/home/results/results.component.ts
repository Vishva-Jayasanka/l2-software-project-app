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
