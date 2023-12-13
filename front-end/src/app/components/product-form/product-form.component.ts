import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs';
import { CategoryApiService } from 'src/app/services/category-api.service';
import { ProductApiService } from 'src/app/services/product-api.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
})
export class ProductFormComponent implements OnInit {
  product = {
    name: '',
    description: '',
    price: '0',
    stock: '0',
    category: '',
    imageValidator: null,
  };

  processing = false;
  categories: any = [];
  image: any;

  productId = '';

  constructor(
    private productService: ProductApiService,
    private categoryService: CategoryApiService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getCategories();
    this.activatedRoute.params.subscribe((params) => {
      if (params['productId'] !== '0') {
        this.productId = params['productId'];
        this.productService
          .getProduct(this.productId)
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
            this.product = res.product;
            this.product.imageValidator = res.product.image.secure_url;
          });
      } else {
        this.product = {
          name: '',
          description: '',
          price: '0',
          stock: '0',
          imageValidator: null,
          category: '',
        };
        this.productId = '';
      }
    });
  }

  getFile(event: any) {
    this.image = event.target.files[0];
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

  createProduct() {
    this.processing = true;

    let formData = new FormData();
    formData.set('name', this.product.name);
    formData.set('description', this.product.description);
    formData.set('price', this.product.price);
    formData.set('stock', this.product.stock);
    formData.set('category', this.product.category);
    formData.set('image', this.image);

    this.productService
      .addProduct(formData)
      .pipe(
        catchError((error) => {
          this.toastrService.error(error.error.message, 'Something Went Wrong');
          this.processing = false;
          return [];
        })
      )
      .subscribe((res) => {
        this.toastrService.success('Product created successfully', 'Success');
        this.router.navigate(['products']);
      });
  }

  updateProduct() {
    this.processing = true;

    let formData = new FormData();
    formData.set('name', this.product.name);
    formData.set('description', this.product.description);
    formData.set('price', this.product.price);
    formData.set('stock', this.product.stock);
    formData.set('category', this.product.category);
    formData.set('image', this.image);

    this.productService
      .updateProduct(formData, this.productId)
      .pipe(
        catchError((error) => {
          this.toastrService.error(error.error.message, 'Something Went Wrong');
          this.processing = false;
          return [];
        })
      )
      .subscribe((res) => {
        this.toastrService.success('Product updated successfully', 'Success');
        this.router.navigate(['products']);
      });
  }
}
