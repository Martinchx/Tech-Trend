import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryApiService {
  private backendUrl: string;

  constructor(private categoryService: HttpClient) {
    this.backendUrl =
      environment.ANGULAR_ENV === 'production'
        ? `${environment.BACKEND_URL_PRODUCTION}category/`
        : `${environment.BACKEND_URL_DEVELOPMENT}category/`;
  }

  getCategories(): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
      }),
    };
    return this.categoryService.get(
      `${this.backendUrl}get-categories`,
      httpOptions
    );
  }

  getCategory(categoryId: string): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
      }),
    };
    return this.categoryService.get(
      `${this.backendUrl}get-category/${categoryId}`,
      httpOptions
    );
  }

  addCategory(category: any): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      }),
    };
    return this.categoryService.post(
      `${this.backendUrl}add-category`,
      category,
      httpOptions
    );
  }

  updateCategory(category: any, categoryId: string): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      }),
    };
    return this.categoryService.put(
      `${this.backendUrl}update-category/${categoryId}`,
      category,
      httpOptions
    );
  }

  deleteCategory(categoryId: any): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      }),
    };
    return this.categoryService.delete(
      `${this.backendUrl}delete-category/${categoryId}`,
      httpOptions
    );
  }
}
