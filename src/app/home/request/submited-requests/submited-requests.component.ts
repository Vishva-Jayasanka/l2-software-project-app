import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../../../_services/authentication.service';
import {DataService} from '../../../_services/data.service';
import {FormControl} from '@angular/forms';
import {Request} from '../update-status/update-status.component';

@Component({
  selector: 'app-submited-requests',
  templateUrl: './submited-requests.component.html',
  styleUrls: ['./submited-requests.component.css']
})
export class SubmitedRequestsComponent implements OnInit {

  requestError = '';
  progress = false;

  requests;
  filter: FormControl = new FormControl('');

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authentication: AuthenticationService,
    private data: DataService
  ) {
    if (this.getRole !== 'Student') {
      router.navigate(['../update-status'], {relativeTo: this.route});
    }
  }

  ngOnInit(): void {
    this.progress = true;
    this.data.getRequests().subscribe(
      response => {
        this.requests = response.requests;
        console.log(this.requests);
      },
      error => {
        this.requestError = error;
      }
    ).add(() => this.progress = false);

    // this.filter.valueChanges.subscribe(value => {
    //   this.filteredRequests = Object.assign([], this.filterRequests(value));
    // });

  }

  get getRole(): string {
    return this.authentication.details.role;
  }

}
