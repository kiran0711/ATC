import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from 'src/shared/service/api.service';
import { SharedService } from 'src/shared/service/shared.service';
import { environment } from 'src/environments/environment';
import { ApiEndpoints } from 'src/shared/utils/api-url';
import { ColDef, SortOrder } from '../../pods-table/pods-table.component';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { locale } from 'moment';
import {
  ActivatedRoute,
  Params,
  Router
} from '@angular/router';
import { CURRENCY_FORMAT } from 'src/app/app.constants';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-host-dashboard',
  templateUrl: './host-dashboard.component.html',
  styleUrls: ['./host-dashboard.component.css']
})
export class HostDashboardComponent implements OnInit, OnDestroy {

  createdListingCount: number = 0;
  sortBy: any = null;
  orderBy: any = null;
  bookingRequest: Array<any> = []
  pastBooking: Array<any> = []
  ongoingBooking: Array<any> = []
  futureBooking: Array<any> = []
  columns: Array<ColDef> = [
    {
      label: 'Listing',
      dataKey: 'booking_id',
      renderer: function (data: any) {
        return '<div class="d-flex align-items-center table-image-block table-cirscle-image-block "><img src="' + data.property_guest.profile_picture + '" alt="" /><div><div>' + data.property_guest.firstname + ' ' + data.property_guest.lastname + '</div></div></div>';
      }
    },
    {
      label: 'Stay',
      dataKey: 'booking_number',
      sort: true,
      sortOrder: SortOrder.asc,
      renderer: function (data: any) {
        return '<div class="d-flex align-items-center table-image-block"><img src="' + data.booked_property.porperty_display_picture + '" alt="" /><div><div>' + data.booked_property.pro_title + '</div><div class="text-14 gray-text">' + data.booked_property.city + '</div></div></div>';
      }
    },
    {
      label: 'Check-in',
      dataKey: 'check_in_date',
      sort: true,
      sortOrder: SortOrder.asc,
      renderer: function (data: any) {
        let datePipe = new DatePipe("en-US")
        return datePipe.transform(data.check_in_date, 'MM-dd-yyyy')
      }
    }, {
      label: 'Check-out',
      dataKey: 'check_out_date',
      sort: true,
      sortOrder: SortOrder.asc,
      renderer: function (data: any) {
        let datePipe = new DatePipe("en-US")
        return datePipe.transform(data.exit_date, 'MM-dd-yyyy')
      }
    }, {
      label: 'Guests',
      dataKey: 'booked_total_guest',
      sort: true,
      sortOrder: SortOrder.asc,
    },
    {
      label: 'Total',
      dataKey: 'booking_number',
      sort: true,
      sortOrder: SortOrder.asc,
      renderer: function (data: any) {
        // return data.amount+' '+data.currency;
        let currencyPipe = new CurrencyPipe('en-US', CURRENCY_FORMAT);
        return currencyPipe.transform(data.amount);
      }
    }
  ];

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  dtTriggerBookingRequest: Subject<any> = new Subject<any>();
  dtTriggerUpcomingBooking: Subject<any> = new Subject<any>();
  dtTriggerPastBooking: Subject<any> = new Subject<any>();
  subscription: Subscription;
  walletBalance: any;
  bookingCount: number;
  dashboardCount: any;
  longTermBookingRequests: any;
  dtTriggerLongTermBookingRequest: Subject<any> = new Subject<any>();

  constructor(
    private router: Router,
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    public sharedService: SharedService,
  ) {
    this.subscription = new Subscription();
  }

  ngOnInit(): void {
    // this.subscription = this.activatedRoute.queryParams.subscribe((params: Params) => {
    //   let index = params['redirect'];
    //   if(index){

    //     let firstValue = index.split('/')[1];

    //     if(firstValue == 'profile'){
    //       this.router.navigateByUrl(`${index}`);
    //     } 
    //     else{
    //       this.router.navigateByUrl(`/booking/${index}`);
    //     }       
    //   }
    // });
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      retrieve: true,
      responsive: true
    };

    // this.apiService.post(environment.baseURL + ApiEndpoints.GET_PROPERTY_LIST, {user_id: this.sharedService.getUserDetails().user_id}).subscribe(
    //   resp => {
    //     this.createdListingCount = resp.data.length;
    //   }
    // );

    this.getBooking('past-bookings', 3)
    this.getBooking('ongoing-bookings', 2)
    this.getBooking('future-bookings', 2)
    this.getRequest();
    this.getWalletBalance();
    this.getDashboardCount();

    this.getLongTermBookingRequest();
  }

  getBooking(type: any, booking_status: any) {
    let reqObject = {
      user_id: this.sharedService.getUserDetails().user_id,
      // user_id: 12,
      user_type: "host",
      per_page: 5,
      booking_type: type,
      page: 1,
      booking_status: booking_status,
    }
    this.apiService.post(environment.baseURL + ApiEndpoints.GET_BOOKING_LIST, reqObject)
      .subscribe(
        resp => {
          if (type == 'past-bookings') {
            this.pastBooking = resp.data.bookings;
            this.dtTriggerPastBooking.next();

          } else if (type == 'ongoing-bookings') {
            this.ongoingBooking = resp.data.bookings;
            this.dtTrigger.next();

          } else if (type == 'future-bookings') {
            this.futureBooking = resp.data.bookings;
            this.dtTriggerUpcomingBooking.next();
          }

        },
        err => {
          console.log(err);
          if (type == 'past-bookings') {
            this.dtTriggerPastBooking.next();

          } else if (type == 'ongoing-bookings') {
            this.dtTrigger.next();

          } else if (type == 'future-bookings') {
            this.dtTriggerUpcomingBooking.next();
          }
        }
      );
  }

  getRequest() {
    let reqObject = {
      user_id: this.sharedService.getUserDetails().user_id,
      // user_id: 35,
      user_type: "host",
      // per_page:5,
      // page:0,
      // request_status:1
    }
    this.apiService.post(environment.baseURL + ApiEndpoints.GET_BOOKING_REQUESTS, reqObject)
      .subscribe(
        resp => {
          console.log(resp)
          this.bookingRequest = resp.data.bookings
          this.dtTriggerBookingRequest.next();
        },
        err => {
          console.log(err);
          this.dtTriggerBookingRequest.next();
        }
      );
  }
  getLongTermBookingRequest() {
    let reqObject = {
      user_id: this.sharedService.getUserDetails().user_id,
      user_type: "host",
    }
    this.apiService.post(environment.baseURL + ApiEndpoints.longTermProperty.GET_BOOKING_REQUESTS, reqObject).subscribe(
        (resp) => {
          this.longTermBookingRequests = resp.data.bookings;
          this.dtTriggerLongTermBookingRequest.next();
        },
        (err) => {
          console.log(err);
          this.dtTriggerLongTermBookingRequest.next();
        }
      );
  }
 
  onClick(id: any) {
    window.open(`/property/detail/${id}`, '_blank');
    // this.router.navigate(["property/detail", booking_id]);
  }
  onClickBookingDetails(booking_id: any) {
    window.open(`/booking/detail/${btoa(booking_id)}`, '_blank');
    // this.router.navigate(["booking/booking-details", btoa(booking_id)]);
  }
  onClickBookingRequestDetails(request_id: any) {
    window.open(`/booking/request-detail/${btoa(request_id)}`, '_blank');
    //this.router.navigate(["booking/booking-details", btoa(booking_id)]);
  } 
  
  onClickLongTermPropertyDetails(id: any) {
    window.open(`/property/long-term/detail/${id}`, '_blank');
    //this.router.navigate(["booking/booking-details", btoa(booking_id)]);
  }
  onClickLongTermBookingRequestDetails(request_id: any) {
    window.open(`/booking/long-term/request/detail/${btoa(request_id)}`, '_blank');
    //this.router.navigate(["booking/booking-details", btoa(booking_id)]);
  }
  onRequestAction(data: any, status: any) {
    if (!window.confirm('Are you Sure')) {
      return;
    }
    let reqObject = {
      user_id: this.sharedService.getUserDetails().user_id,
      request_id: data.request_id,
      request_status: status,
      user_type: "host"
    }
    this.apiService.post(environment.baseURL + ApiEndpoints.CHANGE_STATUS_REQUEST, reqObject)
      .subscribe(
        resp => {
          console.log(resp)
          this.getRequest()
        }
      );
  }

  getWalletBalance() {
    if (!this.sharedService.getUserDetails()) {
      return;
    }
    let reqObj = {
      user_id: this.sharedService.getUserDetails()
        ? this.sharedService.getUserDetails().user_id
        : null,
    };
    this.apiService
      .post(environment.baseURL + ApiEndpoints.GET_WALLET_BALANCE, reqObj)
      .subscribe(
        (data) => {
          this.walletBalance = data.data;
        },
        (error) => {
          this.walletBalance = 0;
          // console.log(error);
        }
      );
  }

  getBookingCount() {
    if (!this.sharedService.getUserDetails()) {
      return;
    }
    let reqObj = {
      user_id: this.sharedService.getUserDetails() ? this.sharedService.getUserDetails().user_id : null,
      user_type: "host"
    };
    this.apiService
      .post(environment.baseURL + ApiEndpoints.DASHBOARD_BOOKING_COUNT, reqObj)
      .subscribe(
        (data) => {
          this.bookingCount = data.data.bookings_count;
        },
        (error) => {
          this.bookingCount = 0;
          // console.log(error);
        }
      );
  }
  getDashboardCount() {
    if (!this.sharedService.getUserDetails()) {
      return;
    }
    let reqObj = {
      user_id: this.sharedService.getUserDetails() ? this.sharedService.getUserDetails().user_id : null,
      user_type: "host"
    };
    this.apiService
      .post(environment.baseURL + ApiEndpoints.DASHBOARD_COUNT, reqObj)
      .subscribe(
        (res) => {
          this.dashboardCount = res.data;
        },
        (error) => {
          console.log(error);
        }
      );
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
