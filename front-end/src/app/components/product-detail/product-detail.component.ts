import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { CartApiService } from 'src/app/services/cart-api.service';
import { ProductApiService } from 'src/app/services/product-api.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  product: any;
  productToAdd = {
    product: '',
    quantity: 1,
  };
  processing = false;

  constructor(
    private productService: ProductApiService,
    private activatedRoute: ActivatedRoute,
    private cartService: CartApiService,
    private authService: AuthApiService,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.getProduct(params['productId']);
    });

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
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
