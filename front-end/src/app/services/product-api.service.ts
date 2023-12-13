import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductApiService {
  private backendUrl: string;

  constructor(private productService: HttpClient) {
    this.backendUrl =
      environment.ANGULAR_ENV === 'production'
        ? `${environment.BACKEND_URL_PRODUCTION}product/`
        : `${environment.BACKEND_URL_DEVELOPMENT}product/`;
  }

  getProducts(): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
      }),
    };
    return this.productService.get(
      `${this.backendUrl}get-products`,
      httpOptions
    );
  }

  getProduct(productId: string): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
      }),
    };
    return this.productService.get(
      `${this.backendUrl}get-product/${productId}`,
      httpOptions
    );
  }

  addProduct(product: any): Observable<any> {
    product.price = parseInt(product.price);
    product.stock = parseInt(product.stock);

    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      }),
    };
    return this.productService.post(
      `${this.backendUrl}add-product`,
      product,
      httpOptions
    );
  }

  updateProduct(product: any, productId: string): Observable<any> {
    product.price = parseInt(product.price);
    product.stock = parseInt(product.stock);

    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      }),
    };
    return this.productService.put(
      `${this.backendUrl}update-product/${productId}`,
      product,
      httpOptions
    );
  }

  deleteProduct(productId: any): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      }),
    };
    return this.productService.delete(
      `${this.backendUrl}delete-product/${productId}`,
      httpOptions
    );
  }

  searchProduct(productName: any): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
      }),
    };
    return this.productService.get(
      `${this.backendUrl}search-products?productName=${productName}`,
      httpOptions
    );
  }

  getProductsByCategory(categoryId: string): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
      }),
    };
    return this.productService.get(
      `${this.backendUrl}get-products-by-category/${categoryId}`,
      httpOptions
    );
  }
}
