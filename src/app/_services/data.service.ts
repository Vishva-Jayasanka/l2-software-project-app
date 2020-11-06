import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

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

  getAssignments() {
    return this.http.post<any>(`${environment.teacherUrl}get-assignments`, {});
  }

  getAttendance() {
    return this.http.post<any>(`${environment.apiUrl}get-attendance`, {});
  }

  getDetailedAttendance(moduleCode: string, type: string, batch: number) {
    return this.http.post<any>(`${environment.apiUrl}get-detailed-attendance`, {moduleCode, type, batch});
  }

  getLectureHours() {
    return this.http.post<any>(`${environment.apiUrl}get-lecture-hours`, {});
  }

  getLectureHoursOfModule(moduleCode: string) {
    return this.http.post<any>(`${environment.adminUrl}get-module-lecture-hours`, {moduleCode});
  }

  getSessions(lectureHourID, batch) {
    return this.http.post<any>(`${environment.adminUrl}get-sessions`, {lectureHourID, batch});
  }

  getTeachers() {
    return this.http.post<any>(`${environment.adminUrl}get-teachers`, {});
  }

  checkIfModuleExists(value) {
    return this.http.post<any>(`${environment.adminUrl}check-module`, {moduleCode: value});
  }

  editModule(data) {
    return this.http.post<any>(`${environment.adminUrl}add-edit-module`, data);
  }

  deleteModule(data) {
    return this.http.post<any>(`${environment.adminUrl}delete-module`, data);
  }

  uploadAttendance(data) {
    return this.http.post<any>(`${environment.adminUrl}upload-attendance`, data);
  }

  getAttendanceOfSession(data: number) {
    return this.http.post<any>(`${environment.adminUrl}get-session-attendance`, {sessionID: data});
  }

  saveAttendanceChanges(data, sessionID: number) {
    return this.http.post<any>(`${environment.adminUrl}save-attendance-changes`, {sessionID, attendance: data});
  }

  getExamsOfModule(moduleCode: string, batch: number) {
    return this.http.post<any>(`${environment.adminUrl}get-module-exams`, {moduleCode, batch});
  }

  uploadExamResults(data) {
    return this.http.post<any>(`${environment.adminUrl}upload-results`, data);
  }

  getExamResults() {
    return this.http.post<any>(`${environment.apiUrl}get-results`, {});
  }

  getResultsOfModule(examID: number) {
    return this.http.post<any>(`${environment.adminUrl}get-module-results`, {examID});
  }

  editResults(results) {
    return this.http.post<any>(`${environment.adminUrl}edit-results`, {results});
  }

  deleteExam(examID: number) {
    return this.http.post<any>(`${environment.adminUrl}delete-exam`, {examID});
  }

  uploadProfilePicture(profilePicture) {
    return this.http.post<any>(`${environment.apiUrl}upload-profile-picture`, {profilePicture});
  }

  getProfilePicture() {
    return this.http.post<any>(`${environment.apiUrl}get-profile-picture`, {});
  }

  uploadPayment(paymentForm) {
    return this.http.post<any>(`${environment.adminUrl}uploadPayment`, {paymentForm});
  }

  registerStudent(studentDetails) {
    return this.http.post<any>(`${environment.adminUrl}register-student`, {studentDetails});
  }

  checkStudentID(studentID) {
    return this.http.post<any>(`${environment.adminUrl}check-student-id`, {studentID});
  }

  getTimetable() {
    return this.http.post<any>(`${environment.apiUrl}get-timetable`, {});
  }

  getStudents() {
    return this.http.post<any>(`${environment.teacherUrl}get-students`, {});
  }

  getNotifications() {
    return this.http.post<any>(`${environment.apiUrl}get-notifications`, {});
  }

  updateNotificationStatus(received: string[]) {
    return this.http.post<any>(`${environment.apiUrl}update-notification-status`, {received});
  }

}
