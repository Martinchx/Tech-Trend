import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CartApiService {
  private backendUrl: string;

  constructor(private cartService: HttpClient) {
    this.backendUrl =
      environment.ANGULAR_ENV === 'production'
        ? `${environment.BACKEND_URL_PRODUCTION}cart/`
        : `${environment.BACKEND_URL_DEVELOPMENT}cart/`;
  }

  getCart(): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      }),
    };
    return this.cartService.get(`${this.backendUrl}get-cart`, httpOptions);
  }

  addProductToCart(product: any): Observable<any> {
    product.quantity = parseInt(product.quantity, 10);

    let httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      }),
    };
    return this.cartService.post(
      `${this.backendUrl}add-products-to-cart`,
      product,
      httpOptions
    );
  }

  updateProductQuantity(productId: string, quantity: number): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      }),
    };
    return this.cartService.put(
      `${this.backendUrl}update-product-quantity/${productId}/${quantity}`,
      {},
      httpOptions
    );
  }

  deleteProductFromCart(productId: string): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      }),
    };
    return this.cartService.delete(
      `${this.backendUrl}delete-product-from-cart/${productId}`,
      httpOptions
    );
  }
}
