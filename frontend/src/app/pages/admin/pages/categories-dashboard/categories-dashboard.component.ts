import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SearchInputComponent } from '../../../../shared/components/search-input/search-input.component';
import {
  CategoriesService,
  FiltersService,
  PaginationService,
  ProductsService,
} from '../../../../core/services';
import { PaginationButtons } from '../../../../core/interfaces/pagination';
import { Category } from '../../../../core/interfaces/categories';
import { SortBy } from '../../../../core/interfaces/filters';
import { Product } from '../../../../core/interfaces/products';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'admin-categories-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchInputComponent],
  templateUrl: './categories-dashboard.component.html',
  styles: ``,
})
export class CategoriesDashboardComponent implements OnInit {
  private readonly hotToastService = inject(HotToastService);

  private readonly categoriesService = inject(CategoriesService);
  private readonly productsService = inject(ProductsService);
  private readonly paginationService = inject(PaginationService);
  private readonly filtersService = inject(FiltersService);

  public categories = signal<Category[]>([]);
  public products = signal<Product[]>([]);
  public currentCategory = signal<Category | undefined>(undefined);
  public processing = signal<boolean>(false);

  public paginationButtons = computed<PaginationButtons>(() =>
    this.paginationService.paginationButtons()
  );

  public sortBy = SortBy;
  public filter = computed(() => this.filtersService.filter());

  constructor() {}

  ngOnInit(): void {
    this.paginationService.setPagination(1, 5);
    this.filtersService.resetFilters();
    this.getAllCategories();
  }

  public getProductsByCategory(category: Category): void {
    this.productsService
      .getAllProducts(
        { page: 1, limit: 9 },
        { sortBy: SortBy.NEWEST },
        category.category_id
      )
      .subscribe({
        next: ({ items }) => {
          this.products.set(items);
        },
        error: (error) => this.hotToastService.error(error),
      });
  }

  public getAllCategories(): void {
    this.categoriesService
      .getAllCategories(
        this.paginationService.pagination(),
        this.filtersService.filter()
      )
      .subscribe({
        next: ({ next, prev, items }) => {
          this.categories.set(items);
          this.paginationService.setPaginationButtons(!!next, !!prev);
        },
        error: (error) => this.hotToastService.error(error),
      });
  }

  public deleteCategory(): void {
    this.processing.update(() => true);
    this.categoriesService
      .deleteCategory(this.currentCategory()!.category_id)
      .subscribe({
        next: () => {
          this.getAllCategories();
          this.hotToastService.success('Category deleted');
          this.processing.update(() => false);
        },
        error: (error) => {
          this.hotToastService.error(error);
          this.processing.update(() => false);
        },
      });
  }

  public applyFilter(filter: SortBy): void {
    this.filtersService.applyFilter(filter, { page: 1, limit: 5 });
    this.getAllCategories();
  }

  public searchCategory(query: string): void {
    this.filtersService.search(query, { page: 1, limit: 5 });
    this.getAllCategories();
  }

  public updatePage(value: number): void {
    this.paginationService.updatePage(value);
    this.getAllCategories();
  }
}
