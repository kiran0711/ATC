import { Component, OnInit,ViewChild } from '@angular/core';
import {
  ActivatedRoute,
  Params,
  Router
} from '@angular/router';
import {
  ApiService
} from 'src/shared/service/api.service';
import {
  ApiEndpoints
} from 'src/shared/utils/api-url';
import * as CONSTANTS from 'src/app/app.constants';
import {
  SharedService
} from 'src/shared/service/shared.service';
import {
  environment
} from 'src/environments/environment';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.css']
})
export class BookingDetailsComponent implements OnInit {
  id:any;
  booking:any;
  map:any;
  center: any;
  infowindow:any;
  service:any;
  nearByPlaces= new Array();
  invoice:any=null;
  isViewInvoice = false;
  isDownloadInvoice = false;

  @ViewChild(MapInfoWindow, {static: false}) infoWindow: MapInfoWindow;
  invoiceArr: any = [];
  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router:Router,
    private sharedService: SharedService,
  ) { 
    this.route.params.subscribe((params: Params) => {
      let id = params['id'];
      this.id=atob(id);
    });
  }

  ngOnInit(): void {
    // debugger
    this.getBookingDetail();
  }

  get role() {
    let r = localStorage.getItem(CONSTANTS.ROLE);
    r = r || '';
    return r;
  }


  getBookingDetail(){
    this.apiService
        .post(environment.baseURL + ApiEndpoints.GET_BOOKING_DETAIL, {
          booking_id: this.id,
          user_id: this.sharedService.getUserDetails().user_id,
          user_type: this.role
        })
        .subscribe(
          (data) => {
            console.log(data);
            this.booking=data.data[0];
            this.center={};
            this.center.lat = parseFloat(this.booking.booked_property.latitude);
            this.center.lng = parseFloat(this.booking.booked_property.longitude);
            this.getNearByPlaces(this.center.lat,this.center.lng)
            this.invoice=this.booking.booking_invoices[this.booking.booking_invoices.length-1];
            this.invoiceArr = this.booking.booking_invoices;
          },
          (error) => {
            console.log(error)
          }
        );
  }

  openInfoWindow(marker: MapMarker, infoWindow: MapInfoWindow) {
    infoWindow.open(marker);
  }

  getNearByPlaces(lat:any,lang:any) {
    let location = new google.maps.LatLng(lat,lang);
    this.map = new google.maps.Map(document.createElement('div'), {
        center: location,
        zoom: 15
      });
    let types=['bus_station','train_station','atm','hospital','restaurant','shopping_mall']
    types.forEach((type:any)=>{
      this.searchByType(type,location)
    })
    
  }
  
  searchByType(type:any,location:any){
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
    this.service.nearbySearch(request, (results:any,status:any)=>{
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        let i = 0;
        while (i < results.length && i <= 1) {
            let element=results[i];
            this.nearByPlaces.push(element)
            i++;
        }
        // results.forEach((element:any) => {
          
        // });
      }
    });
  }
  
  getKmFromNearByPlace(place:any):any{
    let lat1=this.center.lat;
    let lng1=this.center.lng;
    let lat2=place.geometry.location.lat();
    let lng2=place.geometry.location.lng();
    return Math.round(this.getDistanceFromLatLonInKm(lat1,lng1,lat2,lng2) * 100)/100
  
  }
  
  getDistanceFromLatLonInKm(lat1:any,lon1:any,lat2:any,lon2:any) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }
  
  deg2rad(deg:any) {
    return deg * (Math.PI/180)
  }

  cancelBooking(){
    this.apiService
        .post(environment.baseURL + ApiEndpoints.CANCEL_BOOKING, {
          booking_id: this.id,
          user_id: this.sharedService.getUserDetails().user_id,
          user_type:this.role
        })
        .subscribe(
          (data) => {
            console.log(data);
            this.getBookingDetail()
          },
          (error) => {
            console.log(error)
          }
        );
  }

  // download(url:any, downloadName:any) {
  //   this.apiService
  //     .download(url)
  //     .subscribe(blob => {
  //       fs.saveAs(blob, downloadName+'.pdf')
  //     })
  // }

  
  exportPdf(url:any,downloadName:any) {
      this.apiService.download(url).subscribe((data:any) => saveAs(data, downloadName+`.pdf`));
  }
}
