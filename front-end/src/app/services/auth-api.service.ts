import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private backendUrl: string;

  constructor(private authService: HttpClient, private router: Router) {
    this.backendUrl =
      environment.ANGULAR_ENV === 'production'
        ? `${environment.BACKEND_URL_PRODUCTION}auth/`
        : `${environment.BACKEND_URL_DEVELOPMENT}auth/`;
  }

  loggedIn() {
    const token = localStorage.getItem('token');
    const tokenExpiration = localStorage.getItem('tokenExpiration');

    if (!token || !tokenExpiration) return 'notLoggedIn';

    const expirationTime = parseInt(tokenExpiration, 10);
    const currentTime = new Date().getTime();

    return currentTime < expirationTime ? true : 'tokenExpired';
  }

  isAdmin() {
    return localStorage.getItem('userRole') === 'admin';
  }

  signup(user: any): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
      }),
    };
    return this.authService.post(`${this.backendUrl}signup`, user, httpOptions);
  }

  login(user: any): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
      }),
    };
    return this.authService.post(`${this.backendUrl}login`, user, httpOptions);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('tokenExpiration');
    this.router.navigate(['home']);
  }
}
