import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs';
import { OrderApiService } from 'src/app/services/order-api.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  orders: any = [];
  selectedOrder: any;

  constructor(
    private orderService: OrderApiService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders() {
    this.orderService
      .getOrders()
      .pipe(
        catchError((error) => {
          if (error.error.message === 'No orders found')
            this.toastrService.info(
              'No orders have been placed yet',
              'No Orders'
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
        this.orders = res.orders;
      });
  }

  getOrder(orderId: string) {
    this.orderService
      .getOrder(orderId)
      .pipe(
        catchError((error) => {
          this.toastrService.error(error.error.message, 'Something Went Wrong');
          return [];
        })
      )
      .subscribe((res) => {
        this.selectedOrder = res.order;
      });
  }

  applyFilter(op: string) {
    switch (op) {
      case 'total':
        this.orders = this.orders.sort(
          (a: { total: number }, b: { total: number }) => b.total - a.total
        );
        break;
      case 'client':
        this.orders = this.orders.sort(
          (a: { user: { fullname: string } }, b: { user: { fullname: any } }) =>
            a.user.fullname.localeCompare(b.user.fullname)
        );
        break;
      case 'creationDate':
        this.orders = this.orders.sort(
          (
            a: { createdAt: string | number | Date },
            b: { createdAt: string | number | Date }
          ) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      default:
        break;
    }
  }
}
