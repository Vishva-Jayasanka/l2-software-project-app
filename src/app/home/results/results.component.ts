import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AuthenticationService} from '../../_services/authentication.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  moduleCode: string;

  progress = false;

  constructor(
    private route: ActivatedRoute,
    private authentication: AuthenticationService
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.moduleCode = params.moduleCode;
    });
  }

  get getRole() {
    return this.authentication.details.role;
  }

}
