import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs';
import { OrderApiService } from 'src/app/services/order-api.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css'],
})
export class MyOrdersComponent implements OnInit {
  orders: any = [];
  selectedOrder: any;
  tokenFromServer: string | null = null;

  constructor(
    private orderService: OrderApiService,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params['success']) {
        this.tokenFromServer = params['success'];
      }
    });

    this.getOrdersByUser();
  }

  getOrdersByUser() {
    this.orderService
      .getOrdersByUser()
      .pipe(
        catchError((error) => {
          if (error.error.message === 'This users has not orders')
            this.toastrService.info(
              'You currently have no orders',
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
        this.checkAndShowSuccessMessage();
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

  checkAndShowSuccessMessage() {
    if (this.tokenFromServer) {
      const order = this.orders.find(
        (o: { paypalOrderId: string | null }) =>
          o.paypalOrderId === this.tokenFromServer
      );

      if (order && this.isWithinOneMinute(order.createdAt)) {
        this.toastrService.success(
          'Order placed successfully. Thank you for your purchase!',
          'Order Placed'
        );
        this.tokenFromServer = null;
      }
    }
  }

  isWithinOneMinute(createdAt: string): boolean {
    const orderDate = new Date(createdAt);
    const currentDate = new Date();
    const differenceInSeconds =
      (currentDate.getTime() - orderDate.getTime()) / 1000;
    return differenceInSeconds <= 30;
  }
}
