import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthRoleGuard {
  constructor(private router: Router, private toastrService: ToastrService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const userRole = localStorage.getItem('userRole');
    const requestedRoute = state.url;

    if (
      userRole === 'admin' &&
      (requestedRoute.startsWith('/shopping-car') ||
        requestedRoute.startsWith('/my-orders'))
    ) {
      this.toastrService.error(
        'Unauthorized access. Only users can access',
        'Access Denied'
      );
      this.router.navigate(['/home']);
      return false;
    }

    if (
      userRole !== 'admin' &&
      !(
        requestedRoute.startsWith('/shopping-car') ||
        requestedRoute.startsWith('/my-orders')
      )
    ) {
      this.toastrService.error(
        'Unauthorized access. Insufficient role',
        'Access Denied'
      );
      this.router.navigate(['/home']);
      return false;
    }

    return true;
  }
}
