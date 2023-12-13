import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs';
import { CartApiService } from 'src/app/services/cart-api.service';
import { OrderApiService } from 'src/app/services/order-api.service';
import { ProductApiService } from 'src/app/services/product-api.service';

@Component({
  selector: 'app-shopping-car',
  templateUrl: './shopping-car.component.html',
  styleUrls: ['./shopping-car.component.css'],
})
export class ShoppingCarComponent implements OnInit {
  cart: any = [];
  product: any;
  processing = false;

  updatedProduct = {
    product: '',
    quantity: 1,
  };

  constructor(
    private cartService: CartApiService,
    private productService: ProductApiService,
    private orderService: OrderApiService,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getCart();
  }

  getCart() {
    this.cartService
      .getCart()
      .pipe(
        catchError((error) => {
          if (error.error.message === 'This user has not a shopping car')
            this.toastrService.info(
              'Choose products and add them to your cart',
              'Your cart is empty!'
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
        this.cart = res.cartFound;
      });
  }

  getProduct(product: any) {
    this.productService
      .getProduct(product.product._id)
      .pipe(
        catchError((error) => {
          this.toastrService.error(error.error.message, 'Something Went Wrong');
          return [];
        })
      )
      .subscribe((res) => {
        this.product = res.product;
      });

    this.updatedProduct.quantity = product.quantity;
  }

  isInvalidQuantity(quantity: any): boolean {
    return isNaN(+quantity) || +quantity < 1 || +quantity > this.product.stock;
  }

  updateProductQuantity() {
    this.processing = true;
    this.updatedProduct.product = this.product._id;
    this.cartService
      .updateProductQuantity(
        this.updatedProduct.product,
        this.updatedProduct.quantity
      )
      .pipe(
        catchError((error) => {
          this.toastrService.error(error.error.message, 'Something Went Wrong');
          this.processing = false;
          return [];
        })
      )
      .subscribe((res) => {
        this.getCart();
        this.processing = false;
        this.toastrService.info(
          'Cart updated. Quantity modified successfully.',
          'Cart Updated'
        );
      });

    this.updatedProduct.quantity = 1;
  }

  updateQuantity(b: boolean) {
    if (b) this.updatedProduct.quantity++;
    else this.updatedProduct.quantity--;
  }

  deleteProductFromCart() {
    this.processing = true;
    this.cartService
      .deleteProductFromCart(this.product._id)
      .pipe(
        catchError((error) => {
          this.toastrService.error(error.error.message, 'Something Went Wrong');
          this.processing = false;
          return [];
        })
      )
      .subscribe((res) => {
        this.cart = [];
        this.getCart();
        this.processing = false;
        this.toastrService.info(
          'Product removed from your cart. Your choices, your way.',
          'Removed from Cart'
        );
      });
  }

  payProducts() {
    this.processing = true;
    this.orderService
      .createOrder()
      .pipe(
        catchError((error) => {
          this.toastrService.error(error.error.message, 'Something Went Wrong');
          this.processing = false;

          return [];
        })
      )
      .subscribe((res) => {
        this.toastrService.info(
          'You will be redirect to PayPal to confirm the payment',
          'Creating Order'
        );
        window.location.href = res;
      });
  }
}
