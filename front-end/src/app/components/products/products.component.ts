import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs';
import { ProductApiService } from 'src/app/services/product-api.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products: any = [];
  productIdToDelete = '';
  processing = false;

  constructor(
    private productService: ProductApiService,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this.productService
      .getProducts()
      .pipe(
        catchError((error) => {
          if (error.error.message === 'No products found')
            this.toastrService.info(
              'No products have been registered yet',
              'No products'
            );
          else
            this.toastrService.error(
              error.error.message,
              'Something Went Wrong'
            );
          return [];
        })
      )
      .subscribe((res) => {
        this.products = res.products;
      });
  }

  setProductIdToDelete(productId: string) {
    this.productIdToDelete = productId;
  }

  updateProduct(productId: string) {
    this.router.navigate([`product-form/${productId}`]);
  }

  deleteProduct() {
    this.processing = true;

    this.productService
      .deleteProduct(this.productIdToDelete)
      .pipe(
        catchError((error) => {
          this.toastrService.error(error.error.message, 'Something Went Wrong');
          this.processing = false;
          return [];
        })
      )
      .subscribe((res) => {
        this.products = [];
        this.getProducts();
        this.processing = false;
        this.toastrService.success('Product deleted successfully', 'Success');
      });
  }

  applyFilter(op: string) {
    switch (op) {
      case 'name':
        this.products.sort((a: { name: string }, b: { name: any }) =>
          a.name.localeCompare(b.name)
        );
        break;

      case 'price':
        this.products.sort(
          (a: { price: number }, b: { price: number }) => b.price - a.price
        );
        break;

      case 'stock':
        this.products.sort(
          (a: { stock: number }, b: { stock: number }) => b.stock - a.stock
        );
        break;

      case 'category':
        this.products.sort((a: { category: any }, b: { category: any }) =>
          a.category.name.localeCompare(b.category.name)
        );
        break;

      case 'creationDate':
        this.products.sort(
          (
            a: { createdAt: string | number | Date },
            b: { createdAt: string | number | Date }
          ) => {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          }
        );
        break;

      case 'updateDate':
        this.products.sort(
          (
            a: { updatedAt: string | number | Date },
            b: { updatedAt: string | number | Date }
          ) => {
            return (
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            );
          }
        );
        break;
    }
  }
}
