import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { ShoppingCarComponent } from './components/shopping-car/shopping-car.component';
import { UsersComponent } from './components/users/users.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { CategoryFormComponent } from './components/category-form/category-form.component';

import { AuthGuard } from './guards/auth.guard';
import { AuthRoleGuard } from './guards/auth-role.guard';
import { MyOrdersComponent } from './components/my-orders/my-orders.component';
import { OrdersComponent } from './components/orders/orders.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'products-list', component: ProductsListComponent },
  { path: 'product-detail/:productId', component: ProductDetailComponent },
  { path: 'signup', component: SignupComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  {
    path: 'shopping-car',
    component: ShoppingCarComponent,
    canActivate: [AuthGuard, AuthRoleGuard],
  },
  {
    path: 'my-orders',
    component: MyOrdersComponent,
    canActivate: [AuthGuard, AuthRoleGuard],
  },
  {
    path: 'products',
    component: ProductsComponent,
    canActivate: [AuthGuard, AuthRoleGuard],
  },
  {
    path: 'product-form/:productId',
    component: ProductFormComponent,
    canActivate: [AuthGuard, AuthRoleGuard],
  },
  {
    path: 'category-form/:categoryId',
    component: CategoryFormComponent,
    canActivate: [AuthGuard, AuthRoleGuard],
  },
  {
    path: 'categories',
    component: CategoriesComponent,
    canActivate: [AuthGuard, AuthRoleGuard],
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AuthGuard, AuthRoleGuard],
  },
  {
    path: 'orders',
    component: OrdersComponent,
    canActivate: [AuthGuard, AuthRoleGuard],
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
