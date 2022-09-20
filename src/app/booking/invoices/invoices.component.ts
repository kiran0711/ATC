import { Component, OnDestroy, OnInit } from '@angular/core';
import * as CONSTANTS from 'src/app/app.constants';
import { ApiService } from 'src/shared/service/api.service';
import { SharedService } from 'src/shared/service/shared.service';
import { environment } from 'src/environments/environment';
import { ApiEndpoints } from 'src/shared/utils/api-url';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ColDef, SortOrder } from 'src/app/pods-table/pods-table.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css'],
})
export class InvoicesComponent implements OnDestroy, OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  invoices: Array<any> = [];
  columns: Array<ColDef> = [
    {
      label: 'Booking Number',
      dataKey: 'booking_number',
      sort: true,
      sortOrder: SortOrder.asc,
    }, {
      label: 'Date',
      dataKey: 'created_on',
      sort: true,
      sortOrder: SortOrder.asc,
    }, {
      label: 'Billing Fo',
      dataKey: 'booking_guest',
    }, {
      label: 'Status',
      dataKey: 'invoice_type',
      sort: true,
      sortOrder: SortOrder.asc,
      renderer: function (data: any) {
        if (data.invoice_type == 1 || data.invoice_type == 3) {
          return `<span class="btn btn-outline-success">${data.status}</span>`;
        } else {
          return ``;
        }
      },
    }, {
      label: 'Total',
      dataKey: 'booking_amount',
      sort: true,
      sortOrder: SortOrder.asc,
      renderer: function (data: any) {
        let currencyPipe = new CurrencyPipe('en-US', CONSTANTS.CURRENCY_FORMAT);
        return currencyPipe.transform(data.booking_amount);
      },
    }, {
      label: 'Refund',
      dataKey: 'refund_amount',
      sort: true,
      sortOrder: SortOrder.asc,
      renderer: function (data: any) {
        let currencyPipe = new CurrencyPipe('en-US', CONSTANTS.CURRENCY_FORMAT);
        return currencyPipe.transform(data.refund_amount != null ? data.refund_amount : 0);
      }
    }
  ];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    public sharedService: SharedService
  ) { }

  ngOnInit(): void {
    
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      retrieve: true
    };

    this.getInvoices();
  }

  navigateDashboard() {
    if (localStorage.getItem('userdata')) {
      let userStr = localStorage.getItem('userdata') || '{}';
      let user = JSON.parse(userStr);
      if (user.user_type === 1) {
        localStorage.setItem(CONSTANTS.ROLE, 'guest');
        this.router.navigateByUrl('/guest');
      } else if (user.user_type === 2) {
        localStorage.setItem(CONSTANTS.ROLE, 'guest');
        this.router.navigateByUrl('/host');
      } else {
        let role = localStorage.getItem(CONSTANTS.ROLE);
        if (role == 'guest') {
          this.router.navigateByUrl('/guest');
        } else {
          this.router.navigateByUrl('/host');
        }
      }
    }
  }

  get role() {
    let r = localStorage.getItem(CONSTANTS.ROLE);
    r = r || '';
    return r;
  }

  getInvoices() {
    let reqObject = {
      user_id: this.sharedService.getUserDetails().user_id,
      // user_id: 12,
      user_type: this.role,
    };
    this.apiService
      .post(environment.baseURL + ApiEndpoints.GET_INVOICES, reqObject)
      .subscribe(
        (resp) => {
          console.log(resp);
          let keys = Object.keys(resp.data);
          this.invoices = [];
          keys.forEach((element) => {
            this.invoices.push(resp.data[element]);
          });
          this.dtTrigger.next();
          // this.invoices=resp.data.bookings;
        },
        err => {
          console.log(err);
          this.dtTrigger.next();
        }
      );
  }

  onNavigate(url: any) {
    // your logic here.... like set the url
    // const url = 'https://www.google.com';
    if (url) window.open(url, '_blank');
  }
  sortBooking(colDef: any) {
    console.log('sort from booking history', colDef);
    if (colDef.sortOrder == SortOrder.asc) {
      colDef.sortOrder = SortOrder.desc;
    } else {
      colDef.sortOrder = SortOrder.asc;
    }
  }

  onClickInvoiceDetails(data: any) {
    window.open(`/booking/invoice/${data.booking_id}/${data.invoice_type}`, '_blank');
  }
  
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
