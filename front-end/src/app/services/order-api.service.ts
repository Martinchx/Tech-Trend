import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderApiService {
  private backendUrl: string;

  constructor(private orderService: HttpClient) {
    this.backendUrl =
      environment.ANGULAR_ENV === 'production'
        ? `${environment.BACKEND_URL_PRODUCTION}order/`
        : `${environment.BACKEND_URL_DEVELOPMENT}order/`;
  }

  createOrder(): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      }),
    };
    return this.orderService.post(
      `${this.backendUrl}create-order`,
      {},
      httpOptions
    );
  }

  getOrder(orderId: string): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      }),
    };
    return this.orderService.get(
      `${this.backendUrl}get-order/${orderId}`,
      httpOptions
    );
  }

  getOrders(): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      }),
    };
    return this.orderService.get(`${this.backendUrl}get-orders`, httpOptions);
  }

  getOrdersByUser(): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      }),
    };
    return this.orderService.get(
      `${this.backendUrl}get-my-orders`,
      httpOptions
    );
  }
}
