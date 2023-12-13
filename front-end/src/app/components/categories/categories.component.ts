import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs';
import { CategoryApiService } from 'src/app/services/category-api.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  categories: any = [];
  categoryIdToDelete = '';
  processing = false;

  constructor(
    private categoryService: CategoryApiService,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this.categoryService
      .getCategories()
      .pipe(
        catchError((error) => {
          if (error.error.message === 'No categories found')
            this.toastrService.info(
              'No categories have been registered yet',
              'No Categories'
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
        this.categories = res.categories;
      });
  }

  setCategoryIdToDelete(categoryId: string) {
    this.categoryIdToDelete = categoryId;
  }

  updateCategory(categoryId: string) {
    this.router.navigate([`category-form/${categoryId}`]);
  }

  deleteCategory() {
    this.processing = true;
    this.categoryService
      .deleteCategory(this.categoryIdToDelete)
      .pipe(
        catchError((error) => {
          this.toastrService.error(error.error.message, 'Something Went Wrong');
          this.processing = false;
          return [];
        })
      )
      .subscribe((res) => {
        this.categories = [];
        this.getCategories();
        this.processing = false;
        this.toastrService.success('Category deleted successfully', 'Success');
      });
  }

  applyFilter(op: string) {
    switch (op) {
      case 'name':
        this.categories.sort((a: { name: string }, b: { name: any }) =>
          a.name.localeCompare(b.name)
        );
        break;

      case 'products':
        this.categories.sort(
          (a: { products: any }, b: { products: any }) =>
            b.products.length - a.products.length
        );
        break;

      case 'creationDate':
        this.categories.sort(
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
        this.categories.sort(
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
