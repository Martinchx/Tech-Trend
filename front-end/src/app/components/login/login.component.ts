import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs';
import { AuthApiService } from 'src/app/services/auth-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  user = {
    email: '',
    password: '',
  };

  processing = false;

  constructor(
    private authService: AuthApiService,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {}

  login() {
    this.processing = true;

    this.authService
      .login(this.user)
      .pipe(
        catchError((error) => {
          this.toastrService.error(error.error.message, 'Something Went Wrong');
          this.processing = false;
          return [];
        })
      )
      .subscribe((res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('userRole', res.userRole);

        const expirationTime = new Date().getTime() + 2 * 60 * 60 * 1000;
        localStorage.setItem('tokenExpiration', expirationTime.toString());

        this.toastrService.success(
          'Login successful! Welcome back.',
          'Welcome Back!'
        );
        this.router.navigate(['home']);
      });
  }
}
