import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {map} from 'rxjs/operators';

import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

export interface CurrentUser {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: 'Student' | 'Admin' | 'Teacher';
  token: string;
  verified: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
  }

  login(userCredentials) {
    return this.http.post<any>(`${environment.auth}login`, userCredentials).pipe(map(user => {
      const currentUser: CurrentUser = user;
      if (currentUser && currentUser.token) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
      }
      return currentUser;
    }));
  }

  sendPasswordResetEmail(username: string): Observable<any> {
    return this.http.post<any>(`${environment.auth}send-password-reset-email`, {username});
  }

  resetPassword(data: object): Observable<any> {
    return this.http.post<any>(`${environment.auth}reset-password`, data);
  }

  changePassword(data: object): Observable<any> {
    return this.http.post<any>(`${environment.auth}change-password`, data);
  }

  changePasswordVerification(data: object): Observable<any> {
    return this.http.post<any>(`${environment.auth}change-password-verification`, data);
  }

  sendVerificationEmail(email): Observable<any> {
    return this.http.post<any>(`${environment.auth}send-verification-email`, email);
  }

  sendRecoveryEmailVerification(email: string): Observable<any> {
    return this.http.post<any>(`${environment.auth}send-recovery-email-verification`, {email});
  }

  verifyRecoveryEmail(token: string): Observable<any> {
    return this.http.post<any>(`${environment.auth}verify-recovery-email`, {token});
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/auth/login']);
  }

  timeout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/auth/login', {timeout: true}]);
  }

  loggedIn() {
    return !!localStorage.getItem('currentUser');
  }

  get token(): string | null {
    try {
      return this.details.token;
    } catch (Exception) {
      return null;
    }
  }

  get details(): CurrentUser | null {
    try {
      return JSON.parse(localStorage.getItem('currentUser'));
    } catch (Exception) {
      return null;
    }
  }

}
