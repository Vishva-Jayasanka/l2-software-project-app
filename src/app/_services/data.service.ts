import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private http: HttpClient
  ) {
  }

  getModules() {
    return this.http.post<any>(`${environment.apiUrl}get-modules`, {});
  }

  getAttendance() {
    return this.http.post<any>(`${environment.apiUrl}get-attendance`, {});
  }

  getLectureHours() {
    return this.http.post<any>(`${environment.apiUrl}get-lecture-hours`, {});
  }

  getTeachers() {
    return this.http.post<any>(`${environment.adminUrl}get-teachers`, {});
  }

  checkIfModuleExists(value) {
    return this.http.post<any>(`${environment.adminUrl}check-module`, {moduleCode: value}).pipe(map(response => {
      return response.status;
    }));
  }

  editModule(data) {
    return this.http.post<any>(`${environment.adminUrl}add-edit-module`, data);
  }

  deleteModule(data) {
    return this.http.post<any>(`${environment.adminUrl}delete-module`, data);
  }

}
