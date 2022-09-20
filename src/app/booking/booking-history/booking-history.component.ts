import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { ApiService } from 'src/shared/service/api.service';
import { SharedService } from 'src/shared/service/shared.service';
import { environment } from 'src/environments/environment';
import { ApiEndpoints } from 'src/shared/utils/api-url';
import { CURRENCY_FORMAT, ROLE } from 'src/app/app.constants';
import { ColDef, SortOrder } from "src/app/pods-table/pods-table.component";
import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  ActivatedRoute,
  Params,
  Router
} from '@angular/router';
import { Subject, Subscription } from 'rxjs';


@Component({
  selector: 'app-booking-history',
  templateUrl: './booking-history.component.html',
  styleUrls: ['./booking-history.component.css']
})
export class BookingHistoryComponent implements OnInit, OnDestroy {

  isShows: boolean = false;
  tabIndex: Number = -1;
  bookings: Array<any> = [];
  columns: Array<ColDef> = [
    {
      label: 'Listing',
      dataKey: 'booking_id',
      renderer: function (data: any) {
        return '<div class="d-flex align-items-center table-image-block table-cirscle-image-block "><img src="' + data.property_host.profile_picture + '" alt="" /><div><div>' + data.billing_firstname + ' ' + data.billing_lastname + '</div></div></div>';
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
      label: 'Total Amount',
      dataKey: 'booking_number',
      sort: true,
      sortOrder: SortOrder.asc,
      renderer: function (data: any) {
        let currencyPipe = new CurrencyPipe('en-US', CURRENCY_FORMAT);
        return currencyPipe.transform(data.amount);
        // return data.currency.toUpperCase()+' '+ data.amount;
      }
    }
  ];
  currentPage = 1;

  dtOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject<any>();
  dtTriggerCancelledBooking: Subject<any> = new Subject<any>();
  dtTriggerUpcomingBooking: Subject<any> = new Subject<any>();
  dtTriggerPastBooking: Subject<any> = new Subject<any>();

  subscription: Subscription;
  list = document.getElementsByTagName("BODY")[0];
  upcomingBookings: Array<any> = [];
  pastBookings: Array<any> = [];
  cancelledBookings: Array<any> = [];



  constructor(private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    public sharedService: SharedService) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      retrieve: true
    };
    this.getBooking("ongoing-bookings", true, 2)
    this.getBooking("future-bookings", true, 2)
    this.getBooking("past-bookings", true, 3)
    this.getBooking("cancelled-bookings", true, 4)
    // this.subscription = this.route.queryParams.subscribe((params: Params) => {
    //   let index = params['tab'] ? parseInt(params['tab']) : 0
    //   this.changeTab(index)
    // });
  }

  openSidePanel() {
    // alert("djhjdhf");
    this.isShows = !this.isShows;

    this.list.classList.add("overlay-active");
  }
  close() {
    this.isShows = !this.isShows;
    this.list.classList.remove("overlay-active");
  }

  changeTab(index: any) {
    if (this.tabIndex == index) {
      return
    }
    this.tabIndex = index;
    this.router.navigate(['.'], { relativeTo: this.route, queryParams: { tab: this.tabIndex } });

    // switch (index) {
    //   case 1:
    //     this.getBooking("future-bookings", true, 2)
    //     break;
    //   case 2:
    //     this.getBooking("past-bookings", true, 3)
    //     break;
    //   case 3:
    //     this.getBooking("cancelled-bookings", true, 4)
    //     break;
    //   default: this.getBooking("ongoing-bookings", true, 2)
    //     break;
    // }

  }

  get role() {
    let r = localStorage.getItem(ROLE);
    r = r || '';
    return r;
  }

  getBooking(type: any, isRefresh: boolean, booking_status: any) {

    // if (isRefresh) {
    //   this.bookings = [];
    //   this.currentPage = 1
    // }
    let reqObject = {
      user_id: this.sharedService.getUserDetails().user_id,
      // user_id: 12,
      user_type: this.role,
      per_page: 10,
      booking_type: type,
      page: this.currentPage,
      booking_status: booking_status,
    }
    this.apiService.post(environment.baseURL + ApiEndpoints.GET_BOOKING_LIST, reqObject).subscribe(
      resp => {
        this.currentPage++;
        switch (type) {
          case "future-bookings":
            this.upcomingBookings = resp.data.bookings
            this.dtTriggerUpcomingBooking.next();
            break;
          case "past-bookings":
            this.pastBookings = resp.data.bookings
            this.dtTriggerPastBooking.next();
            break;
          case "cancelled-bookings":
            this.cancelledBookings = resp.data.bookings
            this.dtTriggerCancelledBooking.next();
            break;
          case "ongoing-bookings":
            this.bookings = resp.data.bookings
            this.dtTrigger.next();
            break;
          default:
            this.bookings = resp.data.bookings
            this.dtTrigger.next();
            break;
        }
      },
      err => {
        console.log(err);
        switch (type) {
          case "future-bookings":
            this.dtTriggerUpcomingBooking.next();
            break;
          case "past-bookings":
            this.dtTriggerPastBooking.next();
            break;
          case "cancelled-bookings":
            this.dtTriggerCancelledBooking.next();
            break;
          case "ongoing-bookings":
            this.dtTrigger.next();
            break;
          default:
            this.dtTrigger.next();
            break;
        }
      }
    );
  }

  sortBooking(colDef: any) {
    console.log("sort from booking history", colDef);
    if (colDef.sortOrder == SortOrder.asc) {
      colDef.sortOrder = SortOrder.desc;
    } else {
      colDef.sortOrder = SortOrder.asc;
    }

  }

  onClick(booking_id:any){
    window.open(`/property/detail/${booking_id}`, '_blank');
    // this.router.navigate(["property/detail", booking_id]);
  }
  onClickBookingDetails(booking_id:any){
    window.open(`/booking/detail/${btoa(booking_id)}`, '_blank');
    // this.router.navigate(["booking/booking-details", btoa(booking_id)]);
  }

  navigateDashboard() {
    if (localStorage.getItem('userdata')) {
      let userStr = localStorage.getItem('userdata') || '{}';
      let user = JSON.parse(userStr);
      if (user.user_type === 1) {
        localStorage.setItem(ROLE, "guest")
        this.router.navigateByUrl('/guest');
      } else if (user.user_type === 2) {
        localStorage.setItem(ROLE, "guest")
        this.router.navigateByUrl('/host');
      } else {
        let role = localStorage.getItem(ROLE)
        if (role == 'guest') {
          this.router.navigateByUrl('/guest');
        } else {
          this.router.navigateByUrl('/host');
        }

      }
    }
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.dtTriggerPastBooking.unsubscribe();
    this.dtTriggerUpcomingBooking.unsubscribe();
    this.dtTriggerCancelledBooking.unsubscribe();
    // this.subscription.unsubscribe();
  }

}
