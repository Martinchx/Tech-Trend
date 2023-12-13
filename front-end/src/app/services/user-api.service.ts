import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private backendUrl: string;

  constructor(private userService: HttpClient) {
    this.backendUrl =
      environment.ANGULAR_ENV === 'production'
        ? `${environment.BACKEND_URL_PRODUCTION}user/`
        : `${environment.BACKEND_URL_DEVELOPMENT}user/`;
  }

  getUsers(): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      }),
    };
    return this.userService.get(`${this.backendUrl}get-users`, httpOptions);
  }

  getUser(userId: string): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      }),
    };
    return this.userService.get(
      `${this.backendUrl}get-user/${userId}`,
      httpOptions
    );
  }

  updateUser(userId: string, user: any): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      }),
    };
    return this.userService.put(
      `${this.backendUrl}update-user/${userId}`,
      user,
      httpOptions
    );
  }

  deleteUser(userId: string): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      }),
    };
    return this.userService.delete(
      `${this.backendUrl}delete-user/${userId}`,
      httpOptions
    );
  }
}
