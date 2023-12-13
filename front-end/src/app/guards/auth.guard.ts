import { Injectable } from '@angular/core';
import {
  Router,
  UrlTree,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthApiService } from '../services/auth-api.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(
    private authService: AuthApiService,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const authResult = this.authService.loggedIn();
    const requestedRoute = state.url;

    if (
      authResult === 'notLoggedIn' &&
      !(requestedRoute === '/login' || requestedRoute === '/signup')
    ) {
      this.toastrService.error(
        'Unauthorized access. Please log in',
        'Access Denied'
      );
      this.router.navigate(['/login']);
      return false;
    }

    if (authResult === 'tokenExpired') {
      this.toastrService.error(
        'Token expired. Please log in again',
        'Session Expired'
      );
      this.authService.logout();
      this.router.navigate(['/login']);
      return false;
    }

    if (
      authResult === true &&
      (requestedRoute === '/login' || requestedRoute === '/signup')
    ) {
      this.toastrService.error('You are already logged in', 'Access Denied');
      this.router.navigate(['/home']);
      return false;
    }

    return true;
  }
}
