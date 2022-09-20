import { Component, OnDestroy, OnInit } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ROLE } from 'src/app/app.constants';
import { GuestDashboardComponent } from 'src/app/guest/guest-dashboard/guest-dashboard.component';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/shared/service/api.service';
import { SharedService } from 'src/shared/service/shared.service';
import { ApiEndpoints } from 'src/shared/utils/api-url';

@Component({
  selector: 'app-booking-request-details',
  templateUrl: './booking-request-details.component.html',
  styleUrls: ['./booking-request-details.component.css']
})
export class BookingRequestDetailsComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  role: any;
  booking: any;
  loginUser: any;
  map: any;
  center: any;
  infowindow: any;
  service: any;
  nearByPlaces = new Array();
  guestDashboardComponent: GuestDashboardComponent;

  constructor(private router: Router,
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    public sharedService: SharedService) {
    this.subscription = new Subscription();
  }

  ngOnInit(): void {
    this.guestDashboardComponent = new GuestDashboardComponent(this.router, this.apiService, this.activatedRoute, this.sharedService);

    this.role = localStorage.getItem(ROLE);
    this.loginUser = this.sharedService.getUserDetails()
    //get booking request id by params and decode atob method
    this.subscription = this.activatedRoute.params.subscribe((params: Params) => {
      let id = params['id'];
      this.getBookingRequestDetail(atob(id))
    });
  }

  getBookingRequestDetail(id: string) {
    this.apiService
      .post(environment.baseURL + ApiEndpoints.GET_BOOKING_REQUEST_DETAIL, {
        request_id: id,
        user_id: this.loginUser.user_id,
        user_type: this.role
      })
      .subscribe(
        (data) => {
          this.booking = data.data[0];
          this.center = {};
          this.center.lat = parseFloat(this.booking.requested_property.latitude);
          this.center.lng = parseFloat(this.booking.requested_property.longitude);
          this.getNearByPlaces(this.center.lat, this.center.lng)
        },
        (error) => {
          console.log(error)
        }
      );
  }

  openInfoWindow(marker: MapMarker, infoWindow: MapInfoWindow) {
    infoWindow.open(marker);
  }

  getNearByPlaces(lat: any, lang: any) {
    let location = new google.maps.LatLng(lat, lang);
    this.map = new google.maps.Map(document.createElement('div'), {
      center: location,
      zoom: 15
    });
    let types = ['bus_station', 'train_station', 'atm', 'hospital', 'restaurant', 'shopping_mall']
    types.forEach((type: any) => {
      this.searchByType(type, location)
    })

  }

  searchByType(type: any, location: any) {
    var request = {
      location: location,
      radius: '2000',
      type: type
      // radius: '1000',
      // rankBy:google.maps.places.RankBy.DISTANCE,
      // type: ['transit','atm','hospital','restaurant','shopping_mall']
    };

    this.service = new google.maps.places.PlacesService(this.map);
    //this.service.nearbySearch(request, this.callback);
    this.service.nearbySearch(request, (results: any, status: any) => {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        let i = 0;
        while (i < results.length && i <= 1) {
          let element = results[i];
          this.nearByPlaces.push(element)
          i++;
        }
        // results.forEach((element:any) => {

        // });
      }
    });
  }

  getKmFromNearByPlace(place: any): any {
    let lat1 = this.center.lat;
    let lng1 = this.center.lng;
    let lat2 = place.geometry.location.lat();
    let lng2 = place.geometry.location.lng();
    return Math.round(this.getDistanceFromLatLonInKm(lat1, lng1, lat2, lng2) * 100) / 100

  }

  getDistanceFromLatLonInKm(lat1: any, lon1: any, lat2: any, lon2: any) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  deg2rad(deg: any) {
    return deg * (Math.PI / 180)
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
          this.getBookingRequestDetail(data.request_id)
        }
      );
  }

  ngOnDestroy(): void {
    this.subscription ? this.subscription.unsubscribe() : '';
  }
}

