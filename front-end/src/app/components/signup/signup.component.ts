import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs';
import { AuthApiService } from 'src/app/services/auth-api.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  user = {
    fullname: '',
    address: '',
    email: '',
    phone: '',
    password: '',
  };

  processing = false;

  constructor(
    private authService: AuthApiService,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {}

  signup() {
    this.processing = true;

    this.authService
      .signup(this.user)
      .pipe(
        catchError((error) => {
          this.toastrService.error(error.error.message, 'Something Went Wrong');
          this.processing = false;
          return [];
        })
      )
      .subscribe((res) => {
        this.toastrService.success(
          'Registration successful! Welcome to Tech-Trend.',
          'Welcome!'
        );
        this.router.navigate(['login']);
      });
  }
}
