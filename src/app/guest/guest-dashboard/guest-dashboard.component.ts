import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService } from 'src/shared/service/api.service';
import { SharedService } from 'src/shared/service/shared.service';
import { environment } from 'src/environments/environment';
import { ApiEndpoints } from 'src/shared/utils/api-url';
import { SortOrder, ColDef } from '../../pods-table/pods-table.component';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { CURRENCY_FORMAT } from 'src/app/app.constants';
import { Subject, Subscription } from 'rxjs';



@Component({
  selector: 'app-guest-dashboard',
  templateUrl: './guest-dashboard.component.html',
  styleUrls: ['./guest-dashboard.component.css'],
})
export class GuestDashboardComponent implements OnInit, OnDestroy {
  Images = [
    './assets/images/similar-properties.png',
    './assets/images/similar-properties.png',
    './assets/images/similar-properties.png',
    './assets/images/similar-properties.png',
    './assets/images/similar-properties.png',
    './assets/images/similar-properties.png',
    './assets/images/similar-properties.png',
    './assets/images/similar-properties.png',
    './assets/images/similar-properties.png',
  ];

  SlideOptions = { items: 3, dots: false, nav: true };
  CarouselOptions = { items: 3, dots: false, nav: true };
  user: any
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
        return '<div class="d-flex align-items-center table-image-block table-cirscle-image-block "><img src="' + data.property_host.profile_picture + '" alt="" /><div><div>' + data.billing_firstname + ' ' + data.billing_lastname + '</div></div></div>';
      }
    },
    {
      label: 'Stay',
      dataKey: 'booking_number',
      sort: false,
      sortOrder: SortOrder.asc,
      renderer: function (data: any) {
        return '<div class="d-flex align-items-center table-image-block"><img src="' + data.booked_property.porperty_display_picture + '" alt="" /><div><div>' + data.booked_property.pro_title + '</div><div class="text-14 gray-text">' + data.booked_property.city + '</div></div></div>';
      }
    },
    {
      label: 'Check-in',
      dataKey: 'check_in_date',
      sort: false,
      sortOrder: SortOrder.asc,
      renderer: function (data: any) {
        let datePipe = new DatePipe("en-US")
        return datePipe.transform(data.check_in_date, 'MM-dd-yyyy')
      }
    }, {
      label: 'Check-out',
      dataKey: 'check_out_date',
      sort: false,
      sortOrder: SortOrder.asc,
      renderer: function (data: any) {
        let datePipe = new DatePipe("en-US")
        return data.exit_date ? datePipe.transform(data.exit_date, 'MM-dd-yyyy') : datePipe.transform(data.exit_date, 'MM-dd-yyyy')
      }
    }, {
      label: 'Guests',
      dataKey: 'booked_total_guest',
      sort: false,
      sortOrder: SortOrder.asc,
    },
    {
      label: 'Total Amount',
      dataKey: 'booking_number',
      sort: false,
      sortOrder: SortOrder.asc,
      renderer: function (data: any) {
        let currencyPipe = new CurrencyPipe('en-US', CURRENCY_FORMAT);
        return currencyPipe.transform(data.amount);

        // return data.amount+' '+data.currency;
      }
    }
  ];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  dtTriggerBookingRequest: Subject<any> = new Subject<any>();
  dtTriggerUpcomingBooking: Subject<any> = new Subject<any>();
  dtTriggerPastBooking: Subject<any> = new Subject<any>();

  subscription: Subscription;
  property: any;
  imageURL = environment.imageURL + 'storage/';
  longTermBookingRequests: any;
  dtTriggerLongTermBookingRequest: Subject<any> = new Subject<any>();


  constructor(private router: Router,
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    public sharedService: SharedService) {
    this.subscription = new Subscription();
  }

  ngOnInit(): void {
    // this.subscription = this.activatedRoute.queryParams.subscribe((params: Params) => {
    //   let index = params['redirect'];
    //   if (index) {
    //     let firstValue = index.split('/')[1]
    //     if (firstValue == 'profile') {
    //       this.router.navigateByUrl(`${index}`);
    //     }
    //     else {
    //       this.router.navigateByUrl(`/booking/${index}`);
    //     }
    //   }
    // });
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      retrieve: true
    };
    let userStr = localStorage.getItem('userdata') || '{}';
    this.user = JSON.parse(userStr);

    this.getBooking('past-bookings', 3)
    this.getBooking('ongoing-bookings', 2)
    this.getBooking('future-bookings', 2)
    this.getRequest()

    this.getLongTermBookingRequest();

  }
  navigateDashboard() {
    if (localStorage.getItem('userdata')) {
      let userStr = localStorage.getItem('userdata') || '{}';
      let user = JSON.parse(userStr);
      if (user.user_type === 1) {
        this.router.navigateByUrl('/guest');
      } else if (user.user_type === 2) {
        this.router.navigateByUrl('/host');
      } else {
        this.router.navigateByUrl('/guest');
      }
    }
  }

  getBooking(type: any, booking_status: any) {
    let reqObject = {
      user_id: this.sharedService.getUserDetails().user_id,
      // user_id: 12,
      user_type: "guest",
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
  onClick(id:any){
    window.open(`/property/detail/${id}`, '_blank');
    // this.router.navigate(["property/detail", booking_id]);
  }
  onClickBookingDetails(booking_id:any){
    window.open(`/booking/detail/${btoa(booking_id)}`, '_blank');
    // this.router.navigate(["booking/booking-details", btoa(booking_id)]);
  }
  onClickBookingRequestDetails(request_id:any){
    window.open(`/booking/request-detail/${btoa(request_id)}`, '_blank');
    //this.router.navigate(["booking/booking-request-details", btoa(booking_id)]);
  }

  onClickLongTermPropertyDetails(id: any) {
    window.open(`/property/long-term/detail/${id}`, '_blank');
    //this.router.navigate(["booking/booking-details", btoa(booking_id)]);
  }
  onClickLongTermBookingRequestDetails(request_id: any) {
    window.open(`/booking/long-term/request/detail/${btoa(request_id)}`, '_blank');
    //this.router.navigate(["booking/booking-details", btoa(booking_id)]);
  }
  getRequest() {
    let reqObject = {
      user_id: this.sharedService.getUserDetails().user_id,
      // user_id: 35,
      user_type: "guest",
      per_page: 5,
      page: 0
    }
    this.apiService.post(environment.baseURL + ApiEndpoints.GET_BOOKING_REQUESTS, reqObject)
      .subscribe(
        resp => {
          this.bookingRequest = resp.data.bookings
          this.dtTriggerBookingRequest.next();
        },
        err => {
          console.log(err);
          this.dtTriggerBookingRequest.next();
        }
      );
  }

  async bookNow(data: any) {
    if(!window.confirm('Are you Sure')){
      return;
    }

    let booking: any = {
      pro_id: data.pro_id,
      checkin_date: data.checkin_date,
      checkout_date: data.checkout_date,
      adults: data.adults,
      children: data.children,

      
    //booking coming guest dashboard

    booking_mode : 1,
    request_id : data.request_id

    }
    this.getPropertyDetails(data);
    setTimeout(() => {
      this.getPrice(booking);
    }, 1000);
  }

  bookNow2(price: any, booking: any) {
    if (this.property) {
      this.sharedService.bookingSession = {
        property: this.property,
        booking: booking,
        pricing: price,
      };
      this.router.navigate(['/booking/review']);
    }
  }

  async getPrice(booking: any) {
    this.apiService.post(environment.baseURL + ApiEndpoints.GET_PRICE_DETAIL, booking).subscribe(
      (data): any => {
        this.bookNow2(data.data, booking);
      },
      (error): any => {
        console.log(error);
      }
    );
  }
  async getPropertyDetails(bookingData: any) {
    this.apiService.post(environment.baseURL + ApiEndpoints.PROPERTY_DETAIL, { pro_slug: bookingData.requested_property.pro_slug, user_id: bookingData.requested_property.user_id })
      .subscribe(
        (data) => {
          this.property = data.data[0];
          this.property['coverImageData'] = this.getCoverImage(data.data[0]);
          this.property['hostProfilePic'] = this.getHostProfilePic(data.data[0]);
          this.property['totalNearbyPlaces'] = 10;
          this.property['all_image'] = data.data[0].property_image;
          this.property['property_image'] = data.data[0].property_image.filter((obj: any) => { if (obj.is_primary == 0) { return obj; } });
          return this.property
        },
        (error) => {
          console.log(error);
          return this.property
        }
      );
  }

  getCoverImage(poperty: any) {
    let image = poperty.property_image.find((img: any) => img.is_primary == 1);
    let coverImageData: any = {};
    coverImageData['image_caption'] = image ? image.image_caption : '';
    image =
      image && (image.file_type = 'image')
        ? this.imageURL + image.image
        : './assets/images/seasrch-result-1.png';
    coverImageData['image'] = image;
    return coverImageData;
  }
  getHostProfilePic(poperty: any) {
    let image = null;
    if (poperty.property_host) {
      image = this.property.property_host.profile_picture;
    }
    image = image
      ? environment.imageURL + 'storage/' + image
      : './assets/images/testimonail.png';
    return image;
  }










  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.dtTriggerBookingRequest.unsubscribe();
    this.dtTriggerPastBooking.unsubscribe();
    this.dtTriggerUpcomingBooking.unsubscribe();
    this.dtTriggerLongTermBookingRequest.unsubscribe();
  }

  getLongTermBookingRequest() {
    let reqObject = {
      user_id: this.sharedService.getUserDetails().user_id,
      user_type: "guest",
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
}
