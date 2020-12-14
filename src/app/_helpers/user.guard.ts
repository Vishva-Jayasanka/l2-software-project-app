import {Injectable} from '@angular/core';
import {ActivatedRoute, CanActivate, Router} from '@angular/router';

import {AuthenticationService} from '../_services/authentication.service';

@Injectable({
  providedIn: 'root'
})

export class UserGuard implements CanActivate {
  constructor(
    private authentication: AuthenticationService,
    private router: Router
  ) {
  }

  canActivate() {
    if (this.authentication.details.role === 'admin') {
      this.router.navigate(['/results/view-results']);
      return false;
    }
    return true;
  }

}
