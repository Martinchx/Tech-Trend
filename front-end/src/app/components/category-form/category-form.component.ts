import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs';
import { CategoryApiService } from 'src/app/services/category-api.service';
import { ProductApiService } from 'src/app/services/product-api.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css'],
})
export class CategoryFormComponent implements OnInit {
  category = {
    name: '',
    description: '',
    products: [] as string[],
  };

  processing = false;

  categoryId = '';
  products: {
    _id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string;
    status: boolean;
  }[] = [];

  constructor(
    private categoryService: CategoryApiService,
    private productService: ProductApiService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params['categoryId'] !== '0') {
        this.categoryId = params['categoryId'];
        this.categoryService
          .getCategory(this.categoryId)
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
            this.category = res.category;
          });
      } else {
        this.category = {
          name: '',
          description: '',
          products: [] as string[],
        };
        this.categoryId = '';
      }
    });
  }

  createCategory() {
    this.processing = true;

    this.categoryService
      .addCategory(this.category)
      .pipe(
        catchError((error) => {
          this.toastrService.error(error.error.message, 'Something Went Wrong');
          this.processing = false;
          return [];
        })
      )
      .subscribe((res) => {
        this.toastrService.success('Category created successfully', 'Success');
        this.router.navigate(['categories']);
      });
  }

  updateCategory() {
    this.processing = true;

    this.categoryService
      .updateCategory(this.category, this.categoryId)
      .pipe(
        catchError((error) => {
          this.toastrService.error(error.error.message, 'Something Went Wrong');
          this.processing = false;
          return [];
        })
      )
      .subscribe((res) => {
        this.toastrService.success('Category updated successfully', 'Success');
        this.router.navigate(['categories']);
      });
  }

  getProducts() {
    this.productService
      .getProducts()
      .pipe(
        catchError((error) => {
          this.toastrService.error(error.error.message, 'Something Went Wrong');
          return [];
        })
      )
      .subscribe((res) => {
        const categoryProductIds = this.category.products.map(
          (product) => product
        );

        this.products = res.products.map((p: any) => ({
          _id: p._id,
          name: p.name,
          description: p.description,
          price: p.price,
          stock: p.stock,
          image: p.image.secure_url,
          status: categoryProductIds.includes(p._id) ? false : true,
        }));
      });
  }

  addProductToCategory(product: any) {
    this.category.products.push(product._id);
    product.status = false;
  }

  removeProductFromCategory(product: any) {
    const index = this.category.products.indexOf(product._id);
    if (index !== -1) {
      this.category.products.splice(index, 1);
      product.status = true;
    }
  }
}
