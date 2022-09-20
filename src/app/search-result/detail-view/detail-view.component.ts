import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/shared/service/api.service';
import { ApiEndpoints } from 'src/shared/utils/api-url';
import * as CONSTANTS from 'src/app/app.constants';
import { SharedService } from 'src/shared/service/shared.service';
import { Location } from '@angular/common';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { ElementRef, AfterViewInit } from '@angular/core';

// import * as $ from "jquery";


declare var $: any;
// declare var k:JQueryStatic;
var owl = $('.owl-carousel');




import { DatePipe } from '@angular/common';
import { OwlCarousel } from 'ngx-owl-carousel';

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.css'],
})
export class DetailViewComponent implements OnInit {

  bookingSuccessMsg: any;
  metaInfo = CONSTANTS.METADATA;

  ngAfterViewInit() {
    $(document).ready(function () {
      $('.rightSidebar').theiaStickySidebar({
        additionalMarginTop: 100,
      });
      
    });
  }

  slug: string;
  //minimumDate: any;
  minimumDate: Date;

  bookingDetailForm: FormGroup;
  reviewForm: FormGroup;
  property: any = {};
  adultsAndchildren = '0 Adults, 0 Child';
  masterAmenities: any[] = [];
  masterFacilities: any[] = [];
  messageToHost: string = '';
  imageURL = environment.imageURL + 'storage/';
  activeTab = 'about';
  readMore = false;
  center: any;
  services: any;
  state = 0;

  map: any;
  service: any;
  infowindow: any;
  nearByPlaces = new Array();
  bookingInfo: any;
  bookingError: any;
  isShowSocialButtons: boolean = false;
  SlideOptions = {
    stagePadding: 200,
    items: 1,
    slideSpeed: 2000,
    nav: true,
    autoplay: false,
    dots: false,
    loop: true,
    responsive: {
      0: {
        stagePadding: 0,
      },

      767: {
        stagePadding: 100,
      },
      1024: {
        stagePadding: 200,
      },
    },

 

  };
  Thumbptions = {
    items: 8,
    dots: false,
    nav: false,
    smartSpeed: 200,
    slideSpeed: 500,
    slideBy: 4,
    responsiveRefreshRate: 100,
    responsive: {
      0: {
        items: 2,
      },
      480: {
        items: 3,
      },
      767: {
        items: 5,
      },
      1024: {
        items: 8,
      },
    },
  };
  @ViewChild('big') owlBig: OwlCarousel;
  @ViewChild('thumbs') owlThumbs: OwlCarousel;

  
  //    owl.owlCarousel({
  //        loop:true,
  //        margin:10,
  //    });
  
      /*keyboard navigation*/
     

  // checkOutDate:any;
  // checkInDate:any;

  @ViewChild(MapInfoWindow, { static: false }) infoWindow: MapInfoWindow;
  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private sharedService: SharedService,
    private location: Location,
    private titleService: Title,
    private datePipe: DatePipe,
    private meta: Meta
  ) {
  }

  ngOnInit(): void {
    // $('.rightSidebar').theiaStickySidebar({
    //   additionalMarginTop: 100,
    // });

    //let today = new Date();
    //this.minimumDate = today.toISOString().slice(0, 10);
    this.minimumDate = new Date();
    this.minimumDate.setDate(this.minimumDate.getDate());
    this.bookingDetailForm = this.fb.group({
      checkINAndOut: ['', Validators.required],
      // check_in: ['', Validators.required],
      // check_out: ['', Validators.required],
      adults: [1, Validators.min(1)],
      children: [0],
    });
    this.getServicesMasterList();
    this.getPropertyDetails();
    this.autoHideToggle();


    

  }
  updateBigCarousel(value:any){
    this.owlBig.to([value]);
  }



  getServicesMasterList() {
    this.apiService
      .post(environment.baseURL + ApiEndpoints.SERVICES_MASTER_LIST, {})
      .subscribe(
        (data) => {
          console.log(data);
          this.masterAmenities = data.data.amenities_list;
          this.masterFacilities = data.data.facilities_list;
        },
        (error) => {
          console.log(error);
        }
      );
  }
  getPropertyDetails() {
    let subscription = this.route.params.subscribe((params: Params) => {
      this.slug = params['slug'];
      this.apiService
        .post(environment.baseURL + ApiEndpoints.PROPERTY_DETAIL, {
          pro_slug: this.slug,
          user_id: this.sharedService.getUserDetails()
            ? this.sharedService.getUserDetails().user_id
            : null,
        })
        .subscribe(
          (data) => {
            this.property = data.data[0];
            this.state = 1;
            //debugger
            this.center = {};

            let title = '';
            if (
              this.property.property_category &&
              this.property.property_category.cat_name
            ) {
              title += this.property.property_category.cat_name + ' in ';
            }
            if (this.property.pro_title) {
              title += this.property.pro_title;
            }
            if (this.property.city) {
              title += ' in ' + this.property.city;
            }
            this.titleService.setTitle(title);
            

            this.meta.addTags([
              { name: 'description', content: title },
              { name: 'keywords', content: title }  
            ]); 

            this.center.lat = parseFloat(this.property.latitude);
            this.center.lng = parseFloat(this.property.longitude);
            this.property['coverImageData'] = this.getCoverImage(data.data[0]);
            //this.property['amenityImage'] = this.getAmenityImage(data.data[0]);
            this.property['hostProfilePic'] = this.getHostProfilePic(
              data.data[0]
            );
            this.property['totalNearbyPlaces'] = 10;
            this.property['all_image'] = data.data[0].property_image;
            this.property['property_image'] =
              data.data[0].property_image.filter((obj: any) => {
                if (obj.is_primary == 0) {
                  return obj;
                }
              });
            let checkINAndOut = []
            if (this.route.snapshot.queryParamMap.get('startDate')) {
              let checkInDate = <string>(this.route.snapshot.queryParamMap.get('startDate'));
              // this.checkInDate=this.datePipe.transform(new Date(checkInDate),"dd-MM-yyyy")
              // this.bookingDetailForm.controls['checkINAndOut'].patchValue({checkInDate});
              checkINAndOut.push(new Date(checkInDate))
            }
            if (this.route.snapshot.queryParamMap.get('endDate')) {
              let checkOutDate = <string>(this.route.snapshot.queryParamMap.get('endDate'));
              // this.checkOutDate=this.datePipe.transform(new Date(checkOutDate),"dd-MM-yyyy")
              // this.bookingDetailForm.controls['checkINAndOut'].patchValue( checkOutDate);
              checkINAndOut.push(new Date(checkOutDate))

            }
            this.bookingDetailForm.controls['checkINAndOut'].patchValue(checkINAndOut);
            if (this.route.snapshot.queryParamMap.get('adult')) {
              let checkOutDate = <string>(
                this.route.snapshot.queryParamMap.get('adult')
              );
              this.bookingDetailForm.controls['adults'].patchValue(checkOutDate);
            }

            if (this.route.snapshot.queryParamMap.get('children')) {
              let checkOutDate = <string>(
                this.route.snapshot.queryParamMap.get('children')
              );
              this.bookingDetailForm.controls['children'].patchValue(
                checkOutDate
              );
            }

            this.onDataChanged();

            setTimeout(() => {
              this.getNearByPlaces(
                parseFloat(data.data[0].latitude),
                parseFloat(data.data[0].longitude)
              );
            }, 100);

            subscription.unsubscribe();
          },
          (error) => {
            console.log(error);
            this.state = 2;
          }
        );
    });
  }
  autoHideToggle() {
    //jQuery\.noConflict\(\);
    $(document).click((e: any) => {
      if (
        $(e.target).is('#guest_toggle,#guest_toggle *') ||
        $(e.target).is('#collapse_guest,#collapse_guest *')
      ) {
        return;
      } else {
        //jQuery\.noConflict\(\);
        $('#guest_toggle').collapse('hide');
      }
    });
  }
  get bookingFormControl() {
    return this.bookingDetailForm.controls;
  }
  decrease(setAttrName: string) {
    if (this.bookingDetailForm.controls[setAttrName].value > 0) {
      this.bookingDetailForm.controls[setAttrName].setValue(
        Number(this.bookingDetailForm.value[setAttrName]) - 1
      );
      this.onDataChanged();
    }
  }
  increase(setAttrName: string) {
    if (this.bookingDetailForm.controls[setAttrName].value < 100) {
      this.bookingDetailForm.controls[setAttrName].setValue(
        Number(this.bookingDetailForm.value[setAttrName]) + 1
      );
      this.onDataChanged();
    }
  }
  getFees() {
    console.log(this.bookingDetailForm.value);
    let reqBody = {
      pro_id: this.property.pro_id,
      check_in_date: moment(
        new Date(this.bookingDetailForm.value.check_in)
      ).format(CONSTANTS.DOB_API_FORMAT),
      check_out_date: moment(
        new Date(this.bookingDetailForm.value.check_out)
      ).format(CONSTANTS.DOB_API_FORMAT),
      no_of_adult: this.bookingDetailForm.value.adults,
      no_of_child: this.bookingDetailForm.value.children,
    };
    this.apiService
      .post(environment.baseURL + ApiEndpoints.CHECK_BOOKING, reqBody)
      .subscribe((data: any) => {
        console.log('data', data);
      });
  }

  sendMessageToHost() {
    this.apiService
      .post(environment.baseURL + ApiEndpoints.SEND_MSG_TO_PROP_HOST, {
        user_id: this.sharedService.getUserDetails().user_id,
        pro_id: this.property.pro_id,
        message: this.messageToHost,
      })
      .subscribe(
        (data) => {
          console.log(data);
        },
        (error) => {
          console.log(error);
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

  getAmenityAndFacilityImage(service_id: any, type: any) {
    if (type == 'facility') {
      let amenityAndFaciltyImage = this.masterFacilities.find(
        (amenity: any) => amenity.service_id == service_id
      );
      amenityAndFaciltyImage = amenityAndFaciltyImage
        ? environment.imageURL + amenityAndFaciltyImage.service_image
        : '';
      return amenityAndFaciltyImage;
    } else {
      let amenityAndFaciltyImage = this.masterAmenities.find(
        (amenity: any) => amenity.service_id == service_id
      );
      amenityAndFaciltyImage = amenityAndFaciltyImage
        ? environment.imageURL + amenityAndFaciltyImage.service_image
        : '';
      return amenityAndFaciltyImage;
    }
  }
  getAmenityAndFacilityName(service_id: any, type: any) {
    if (type == 'facility') {
      let amenityName = this.masterFacilities.find(
        (amenity: any) => amenity.service_id == service_id
      );
      amenityName = amenityName ? amenityName.service_name : '';
      return amenityName;
    } else {
      let amenityName = this.masterAmenities.find(
        (amenity: any) => amenity.service_id == service_id
      );
      amenityName = amenityName ? amenityName.service_name : '';
      return amenityName;
    }
  }
  scrollToView(el: HTMLElement) {
    this.activeTab = el.id;
    // el.scrollIntoView({block: "start"});
    let position = el.getBoundingClientRect();
    // scrolls to 20px above element
    window.scrollTo(position.left, position.top + window.scrollY - 80);
  }
  counter(i: number) {
    return new Array(Number(i));
  }
  readMoreReview(i: number) {
    (<HTMLInputElement>document.getElementById('more' + i)).style.display =
      'block';
    (<HTMLInputElement>document.getElementById('less' + i)).style.display =
      'none';
    (<HTMLInputElement>document.getElementById('lessBtn' + i)).style.display =
      'none';
    (<HTMLInputElement>document.getElementById('moreBtn' + i)).style.display =
      'block';
  }
  readLessReview(i: number) {
    (<HTMLInputElement>document.getElementById('more' + i)).style.display =
      'none';
    (<HTMLInputElement>document.getElementById('less' + i)).style.display =
      'block';
    (<HTMLInputElement>document.getElementById('moreBtn' + i)).style.display =
      'none';
    (<HTMLInputElement>document.getElementById('lessBtn' + i)).style.display =
      'block';
  }

  parseFloat(cordinates: any) {
    return parseFloat(cordinates);
  }
  /* let map: google.maps.Map;
  const center: google.maps.LatLngLiteral = {lat: 30, lng: -110};
  
  function initMap(): void {
    map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
      center,
      zoom: 8
    });
  }
 */

  getNearByPlaces(lat: any, lang: any) {
    let location = new google.maps.LatLng(lat, lang);
    this.map = new google.maps.Map(document.createElement('div'), {
      center: location,
      zoom: 15,
    });
    let types = [
      'bus_station',
      'subway_station',
      'train_station',
      'atm',
      'hospital',
      'restaurant',
      'shopping_mall',
    ];
    types.forEach((type: any) => {
      this.searchByType(type, location);
    });
  }

  searchByType(type: any, location: any) {
    var request = {
      location: location,
      radius: '2000',
      type: type,
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
          this.nearByPlaces.push(element);
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
    return (
      Math.round(this.getDistanceFromLatLonInKm(lat1, lng1, lat2, lng2) * 100) /
      100
    );
  }

  getDistanceFromLatLonInKm(lat1: any, lon1: any, lat2: any, lon2: any) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2 - lat1); // deg2rad below
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
      Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }
  deg2rad(deg: any) {
    return deg * (Math.PI / 180);
  }

  /*  callback(results:any, status:any) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      console.log(results, typeof results);
      //this.nearByPlaces=results;
      //console.log(this.nearByPlaces);
  
      for (var i = 0; i < results.length; i++) {
        //createMarker(results[i]);
        this.nearByPlaces.push(results[i]);
      }
      console.log(this.nearByPlaces);
    }
  } */


  back(): void {
    this.location.back();
  }

  openInfoWindow(marker: MapMarker, infoWindow: MapInfoWindow) {
    infoWindow.open(marker);
  }
  saveReview() { }
  toggleSocialButtons() {
    this.isShowSocialButtons = !this.isShowSocialButtons;
  }

  getPrice() {
    let checkINAndOut: any = this.bookingFormControl['checkINAndOut'].value;
    let reqObject = {
      pro_id: this.property.pro_id,
      checkin_date: this.datePipe.transform(checkINAndOut[0], 'yyyy-MM-dd'),
      checkout_date: this.datePipe.transform(checkINAndOut[1], 'yyyy-MM-dd'),
      adults: this.bookingFormControl['adults'].value,
      children: this.bookingFormControl['children'].value,
    };
    this.apiService.post(environment.baseURL + ApiEndpoints.GET_PRICE_DETAIL, reqObject).subscribe((data): void => {
      this.bookingInfo = data.data;
      this.bookingError = null;
    },
      (error): void => {
        this.bookingError = error.message;
        this.bookingInfo = null;
        console.log(error);
      }
    );
  }

  onDataChanged() {
    console.log(this.bookingFormControl);

    if (this.bookingFormControl['checkINAndOut'].value.length == 2) {

      this.getPrice();
      // let reqFields:any={};
      // if(this.bookingDetailForm.value.check_in){
      // reqFields.startDate = this.bookingDetailForm.value.check_in
      // }
      // if(this.bookingDetailForm.value.check_out){
      //   reqFields.endDate = this.bookingDetailForm.value.check_out
      // }
      // if(this.bookingDetailForm.value.children){
      //   reqFields.children = this.bookingDetailForm.value.children
      // }
      // if(this.bookingDetailForm.value.adults){
      //   reqFields.adults = this.bookingDetailForm.value.adults
      // }
      // this.router.navigate(['.'], { relativeTo: this.route, queryParams: reqFields});
    }
  }

  keys(data: any) {
    return Object.keys(data);
  }

  get role() {
    let r = localStorage.getItem(CONSTANTS.ROLE);
    r = r || '';
    return r;
  }

  proceedWithBooking() {
    if (
      !this.sharedService.getUserDetails() ||
      !this.sharedService.getUserDetails().user_id
    ) {
      this.sharedService.openLoginPopup.next({ login: false });
      return;
    } else if (this.role == CONSTANTS.HOST) {
      this.bookingError = 'Please change your user to guest for booking';
      return;
    }
    let checkINAndOut: any = this.bookingFormControl['checkINAndOut'].value;

    this.sharedService.bookingSession = {
      property: this.property,
      booking: {
        pro_id: this.property.pro_id,
        checkin_date: this.datePipe.transform(checkINAndOut[0], 'yyyy-MM-dd'),
        checkout_date: this.datePipe.transform(checkINAndOut[1], 'yyyy-MM-dd'),
        adults: this.bookingFormControl['adults'].value,
        children: this.bookingFormControl['children'].value,

        //booking normal

        booking_mode: 0,
        request_id: null
      },
      pricing: this.bookingInfo,
    };

    this.router.navigateByUrl('/booking/review');
  }

  proceedWithRequesting() {
    if (
      !this.sharedService.getUserDetails() ||
      !this.sharedService.getUserDetails().user_id
    ) {
      this.sharedService.openLoginPopup.next({ login: false });
      return;
    } else if (this.role == CONSTANTS.HOST) {
      this.bookingError = 'Please change your user to guest for booking';
      return;
    }
    let checkINAndOut: any = this.bookingFormControl['checkINAndOut'].value;
    let request = {
      pro_id: this.property.pro_id,
      user_id: this.sharedService.getUserDetails().user_id,
      checkin_date: this.datePipe.transform(checkINAndOut[0], 'yyyy-MM-dd'),
      checkout_date: this.datePipe.transform(checkINAndOut[1], 'yyyy-MM-dd'),
      adults: this.bookingFormControl['adults'].value,
      children: this.bookingFormControl['children'].value,
    };

    this.apiService
      .post(environment.baseURL + ApiEndpoints.REQUEST_BOOKING, request)
      .subscribe(
        (data) => {
          this.bookingSuccessMsg = data.message;
          this.bookingError = null;
          this.bookingInfo = null;
        },
        (error): void => {
          this.bookingError = error.message;
          this.bookingInfo = null;
          this.bookingSuccessMsg = null;
          console.log(error);
        }
      );
  }

  getDatePlusOne(date: string): string {
    if (!date) {
      return '';
    }
    let nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    return nextDate.toISOString().slice(0, 10);
  }

  getNextDate(event: any) {
    let nextDate = new Date(event.target.value);
    nextDate.setDate(nextDate.getDate() + 1);
    let dateString = nextDate.toISOString().slice(0, 10);
    this.bookingDetailForm.controls['check_out'].setValue(dateString);
    this.onDataChanged();
  }


  @HostListener('document:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowLeft':
        this.owlBig.trigger('prev.owl.carousel', [700]);
        break;
      case 'ArrowRight':
        this.owlBig.trigger('next.owl.carousel', [700]);
        break;
      default:
        break;
    }
  }



}
