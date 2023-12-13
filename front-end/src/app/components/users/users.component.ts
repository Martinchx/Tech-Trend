import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs';
import { UserApiService } from 'src/app/services/user-api.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  users: any = [];
  selectedUser = '';
  processing = false;

  updatedUser = {
    fullname: '',
    email: '',
    address: '',
    phone: '',
  };

  constructor(
    private userService: UserApiService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.userService
      .getUsers()
      .pipe(
        catchError((error) => {
          if (error.error.message === 'No users')
            this.toastrService.info('No users has registered yet', 'No Users');
          else
            this.toastrService.error(
              error.error.message,
              'Something Went Wrong'
            );
          return [];
        })
      )
      .subscribe((res) => {
        this.users = res.users;
      });
  }

  getUser() {
    this.userService
      .getUser(this.selectedUser)
      .pipe(
        catchError((error) => {
          this.toastrService.error(error.error.message, 'Something Went Wrong');
          return [];
        })
      )
      .subscribe((res) => {
        this.updatedUser = res.user;
      });
  }

  updateUser() {
    this.processing = true;
    this.userService
      .updateUser(this.selectedUser, this.updatedUser)
      .pipe(
        catchError((error) => {
          this.toastrService.error(error.error.message, 'Something Went Wrong');
          this.processing = false;
          return [];
        })
      )
      .subscribe((res) => {
        this.getUsers();
        this.processing = false;
        this.toastrService.success('User updated successfully', 'Success');
      });
  }

  deleteUser() {
    this.processing = true;
    this.userService
      .deleteUser(this.selectedUser)
      .pipe(
        catchError((error) => {
          this.toastrService.error(error.error.message, 'Something Went Wrong');
          this.processing = false;
          return [];
        })
      )
      .subscribe((res) => {
        this.users = [];
        this.getUsers();
        this.processing = false;
        this.toastrService.success('User deleted successfully', 'Success');
      });
  }

  applyFilter(op: string) {
    switch (op) {
      case 'fullname':
        this.users = this.users.sort(
          (a: { fullname: string }, b: { fullname: string }) => {
            return a.fullname.localeCompare(b.fullname);
          }
        );
        break;

      case 'role':
        this.users.sort((a: { role: string }, b: { role: string }) => {
          if (a.role === 'admin' && b.role === 'user') {
            return -1;
          } else if (a.role === 'user' && b.role === 'admin') {
            return 1;
          } else {
            return 0;
          }
        });
        break;
      case 'email':
        this.users.sort((a: { email: string }, b: { email: string }) => {
          return a.email.localeCompare(b.email);
        });
        break;

      case 'creationDate':
        this.users.sort(
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
        this.users.sort(
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

  setSelectedUser(userId: string) {
    this.selectedUser = userId;
    this.getUser();
  }
}
