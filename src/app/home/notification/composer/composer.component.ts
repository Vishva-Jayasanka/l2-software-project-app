import { Component, OnInit } from '@angular/core';
import {UserDataService} from '../../../_services/user-data.service';

@Component({
  selector: 'app-composer',
  templateUrl: './composer.component.html',
  styleUrls: ['./composer.component.css']
})
export class ComposerComponent implements OnInit {

  constructor(
    public userData: UserDataService
  ) { }

  ngOnInit(): void {
  }

}
