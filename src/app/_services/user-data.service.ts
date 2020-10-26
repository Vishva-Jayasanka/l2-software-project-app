import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Subject} from 'rxjs';
import {DataService} from './data.service';

@Injectable({
  providedIn: 'root'
})

export class UserDataService {

  profilePicture: string;
  profilePictureChange: Subject<string> = new Subject<string>();

  constructor(
    private data: DataService
  ) {
    this.profilePictureChange.subscribe(value => this.profilePicture = value);
  }

  changeProfilePicture(profilePicture: string) {
    this.profilePictureChange.next(profilePicture);
  }

}
