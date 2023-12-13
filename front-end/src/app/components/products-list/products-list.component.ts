import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { CartApiService } from 'src/app/services/cart-api.service';
import { CategoryApiService } from 'src/app/services/category-api.service';
import { ProductApiService } from 'src/app/services/product-api.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css'],
})
export class ProductsListComponent implements OnInit {
  products: any = [];
  categories: any = [];
  product: any;
  processing = false;

  productToSearch = '';
  activeCategory = '';

  productToAdd = {
    product: '',
    quantity: 1,
  };

  constructor(
    private productService: ProductApiService,
    private categoryService: CategoryApiService,
    private cartService: CartApiService,
    private authService: AuthApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params['category'] !== '0') {
        this.categoryService
          .getCategory(params['category'])
          .pipe(
            catchError((error) => {
              this.toastrService.error(
                error.error.message,
                'Something Went Wrong'
              );
              return [];
            })
          )
          .subscribe((res) => {
            this.setActiveCategory(res.category);
          });
      } else {
        this.getProducts();
      }
    });
    this.getCategories();
  }

  setActiveCategory(category: any) {
    if (this.activeCategory === category.name) {
      this.activeCategory = '';
      this.getProducts();
    } else {
      this.activeCategory = category.name;
      this.getProductsByCategory(category);
    }
  }

  getProducts() {
    this.productService
      .getProducts()
      .pipe(
        catchError((error) => {
          if (error.error.message === 'No products found')
            this.toastrService.info(
              'No products have been registered yet',
              'No Products'
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
        this.products = res.products.filter(
          (p: { stock: number }) => p.stock > 0
        );
      });
  }

  getProduct(productId: string) {
    this.productService
      .getProduct(productId)
      .pipe(
        catchError((error) => {
          this.toastrService.error(error.error.message, 'Something Went Wrong');
          return [];
        })
      )
      .subscribe((res) => {
        this.product = res.product;
      });
  }

  getCategories() {
    this.categoryService
      .getCategories()
      .pipe(
        catchError((error) => {
          this.toastrService.error(error.error.message, 'Something Went Wrong');
          return [];
        })
      )
      .subscribe((res) => {
        this.categories = res.categories;
      });
  }

  searchProduct() {
    this.productService
      .searchProduct(this.productToSearch)
      .pipe(
        catchError((error) => {
          this.toastrService.error(error.error.message, 'Something Went Wrong');
          return [];
        })
      )
      .subscribe((res) => {
        this.products = res.products;
      });
  }

  getProductsByCategory(category: any) {
    this.productService
      .getProductsByCategory(category._id)
      .pipe(
        catchError((error) => {
          if (error.error.message === 'No products found')
            this.toastrService.info(
              'No products have been registered yet',
              'No Products'
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

  viewDetails(product: any) {
    this.router.navigate(['/product-detail', product._id]);
  }

  isInvalidQuantity(quantity: any): boolean {
    return isNaN(+quantity) || +quantity < 1 || +quantity > this.product.stock;
  }

  addProductToCart(product: any) {
    const authStatus = this.authService.loggedIn();

    if (authStatus === 'notLoggedIn') {
      this.toastrService.warning(
        'You need to be logged in',
        'Authentication Required'
      );
      this.router.navigate(['login']);
    } else if (authStatus === 'tokenExpired') {
      this.toastrService.error(
        'Your session has expired. Please log in again.',
        'Session Expired'
      );
      this.router.navigate(['login']);
    } else {
      this.processing = true;
      this.productToAdd.product = product._id;
      this.cartService
        .addProductToCart(this.productToAdd)
        .pipe(
          catchError((error) => {
            this.toastrService.error(
              error.error.message,
              'Something Went Wrong'
            );
            this.processing = false;
            return [];
          })
        )
        .subscribe((res) => {
          this.processing = false;
          this.toastrService.info(
            'Product added to your cart. Happy shopping!',
            'Added to Cart'
          );
        });

      this.productToAdd.quantity = 1;
    }
  }

  updateQuantity(b: boolean) {
    if (b) this.productToAdd.quantity++;
    else this.productToAdd.quantity--;
  }
}
