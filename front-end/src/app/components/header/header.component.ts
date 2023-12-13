import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { CategoryApiService } from 'src/app/services/category-api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  categories: any = [];

  constructor(
    private categoryService: CategoryApiService,
    private authService: AuthApiService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getCategories();
  }

  logout() {
    this.authService.logout();
    this.toastrService.success(
      'Logout successful. Have a great day!',
      'See You Soon!'
    );
  }

  isLogged() {
    return this.authService.loggedIn() === true;
  }

  isAdmin() {
    return this.authService.isAdmin();
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
}
