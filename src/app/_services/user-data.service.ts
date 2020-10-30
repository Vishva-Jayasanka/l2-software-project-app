import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Subject} from 'rxjs';
import {DataService} from './data.service';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class UserDataService {

  profilePicture: string;
  profilePictureChange: Subject<string> = new Subject<string>();

  constructor(
    private http: HttpClient
  ) {
    this.profilePictureChange.subscribe(value => this.profilePicture = value);
  }

  changeProfilePicture(profilePicture: string) {
    this.profilePictureChange.next(profilePicture);
  }

  getUserDetails() {
    return this.http.post<any>(`${environment.apiUrl}get-user-details`, {});
  }

}
