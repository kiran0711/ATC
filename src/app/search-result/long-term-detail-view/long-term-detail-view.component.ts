import { DatePipe } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { OwlCarousel } from 'ngx-owl-carousel';
import { Subscription } from 'rxjs';
import { Earning_Member_Status, leaseDurations, ROLE } from 'src/app/app.constants';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/shared/service/api.service';
import { SharedService } from 'src/shared/service/shared.service';
import { ApiEndpoints } from 'src/shared/utils/api-url';

@Component({
  selector: 'app-long-term-detail-view',
  templateUrl: './long-term-detail-view.component.html',
  styleUrls: ['./long-term-detail-view.component.css']
})
export class LongTermDetailViewComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  slug: any;
  property: any;
  center: any;
  imageURL = environment.imageURL + 'storage/';
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
  activeTab: string = 'about';
  map: any;
  service: any;
  nearByPlaces: any = [];
  bookingForm: FormGroup
  leaseDurations: any = [];
  minimumDate: Date;
  earning_member_detail_obj: any = {
    employment_status: '',
    other_status_text: '',
    grass_annual_income: ''
  }
  earning_member_details: any = [{ ...this.earning_member_detail_obj }];
  earning_member_status: any = Earning_Member_Status;
  loginUser: any;
  bookingFormError: any;
  bookingFormResponse: any;
  userCurrentlySelectedRole: any;

  constructor(
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    public sharedService: SharedService,
    private titleService: Title,
    private datePipe: DatePipe,
    private metaService: Meta,
    private formBuilder: FormBuilder,
  ) {
    this.subscription = new Subscription();
    this.bookingForm = this.formBuilder.group({
      pro_id: ['', Validators.required],
      user_id: ['', Validators.required],
      user_type: ['', Validators.required],
      lease_duration: ['', Validators.required],
      lease_start_date: ['', Validators.required],
      is_student: [false],
      no_of_occupants: [1],
      no_of_earning_members: [1],
      earning_member_details: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    this.minimumDate = new Date();
    this.minimumDate.setDate(this.minimumDate.getDate());
    this.loginUser = this.sharedService.getUserDetails()
    this.userCurrentlySelectedRole = localStorage.getItem(ROLE);
    this.subscription = this.activatedRoute.params.subscribe((params: Params) => {
      this.slug = params['slug'];
    });
    this.getPropertyDetails();
  }

  get totalIncomeMember() {
    let totalIncome: number = 0;
    this.earning_member_details.forEach((element: { grass_annual_income: string }) => {
      if (element.grass_annual_income) {
        totalIncome += parseFloat(element.grass_annual_income);
      }
    });
    return totalIncome;
  }

  getPropertyDetails() {
    this.center = {};
    this.apiService.post(environment.baseURL + ApiEndpoints.longTermProperty.PROPERTY_DETAIL, { pro_slug: this.slug }).subscribe(
      (res: any) => {
        this.property = res.data[0];

        //SEO Related codes
        let title = '';
        if (this.property.property_category && this.property.property_category.cat_name) {
          title += this.property.property_category.cat_name + ' in ';
        }
        if (this.property.pro_title) {
          title += this.property.pro_title;
        }
        if (this.property.city) {
          title += ' in ' + this.property.city;
        }
        this.titleService.setTitle(title);
        this.metaService.addTags([
          { name: 'description', content: title },
          { name: 'keywords', content: title }
        ]);

        this.center.lat = parseFloat(this.property.latitude);
        this.center.lng = parseFloat(this.property.longitude);
        this.property['totalNearbyPlaces'] = 10;

        this.property['coverImageData'] = this.getCoverImage(res.data[0]);
        this.property['hostProfilePic'] = this.getHostProfilePic(res.data[0]);
        this.property['all_image'] = res.data[0].property_longterm_image;
        this.property['property_image'] = res.data[0].property_longterm_image.filter((obj: any) => {
          if (obj.is_primary == 0) {
            return obj;
          }
        });

        //set custom lease Durations
        leaseDurations.forEach((element: { value: number; }) => {
          if (element.value >= parseInt(res.data[0].property_longterm_leasing_details.minimum_lease_duration) && element.value <= parseInt(res.data[0].property_longterm_leasing_details.maximum_lease_duration)) {
            this.leaseDurations.push(element);
          }
        });


        this.bookingForm.patchValue({
          pro_id: res.data[0].pro_id,
          user_id: this.loginUser.user_id,
          user_type: this.userCurrentlySelectedRole
        });

        setTimeout(() => {
          this.getNearByPlaces(
            parseFloat(res.data[0].latitude),
            parseFloat(res.data[0].longitude)
          );
        }, 100);

      },
      (error: any) => {
        console.log(error);
      }
    );
  }
  getCoverImage(poperty: any) {
    let image = poperty.property_longterm_image.find((img: any) => img.is_primary == 1);
    let coverImageData: any = {};
    coverImageData['image_caption'] = image ? image.image_caption : '';
    image = image && (image.file_type = 'image') ? this.imageURL + image.image : './assets/images/seasrch-result-1.png';
    coverImageData['image'] = image;
    return coverImageData;
  }
  getHostProfilePic(poperty: any) {
    let image = null;
    if (poperty.property_host) {
      image = this.property.property_host.profile_picture;
    }
    image = image ? this.imageURL + image : './assets/images/testimonail.png';
    return image;
  }

  updateBigCarousel(value: any) {
    this.owlBig.to([value]);
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

  scrollToView(el: HTMLElement) {
    this.activeTab = el.id;
    // el.scrollIntoView({block: "start"});
    let position = el.getBoundingClientRect();
    // scrolls to 20px above element
    window.scrollTo(position.left, position.top + window.scrollY - 80);
  }
  openInfoWindow(marker: MapMarker, infoWindow: MapInfoWindow) {
    infoWindow.open(marker);
  }
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



  //Booking 
  get bookingFormControl() {
    return this.bookingForm.controls;
  }

  increaseOccupants(setAttrName: string) {
    if (this.bookingForm.controls[setAttrName].value < this.property.property_longterm_attribute.no_of_occupants) {
      this.bookingForm.controls[setAttrName].patchValue(
        Number(this.bookingForm.value[setAttrName]) + 1
      );
    }
  }
  decreaseOccupants(setAttrName: string) {
    if (this.bookingForm.controls[setAttrName].value > 1) {
      this.bookingForm.controls[setAttrName].patchValue(
        Number(this.bookingForm.value[setAttrName]) - 1
      );
      if (this.earning_member_details.length > 1) {
        this.bookingForm.patchValue({ no_of_earning_members: Number(this.bookingForm.value['no_of_earning_members']) - 1 });
        this.earning_member_details = this.earning_member_details.filter((item: any, index: number) => index !== this.earning_member_details.length - 1)
      }

    }
  }
  increaseEarningMember(setAttrName: string) {
    let no_of_earning_members = this.bookingFormControl.no_of_occupants.value > 3 ? 3 : this.bookingFormControl.no_of_occupants.value;
    if (this.bookingForm.controls[setAttrName].value < no_of_earning_members) {
      this.bookingForm.controls[setAttrName].patchValue(
        Number(this.bookingForm.value[setAttrName]) + 1
      );
      this.earning_member_details.push({ ...this.earning_member_detail_obj })
    }
  }
  decreaseEarningMember(setAttrName: string) {
    if (this.bookingForm.controls[setAttrName].value > 1) {
      this.bookingForm.controls[setAttrName].patchValue(
        Number(this.bookingForm.value[setAttrName]) - 1
      );
      this.earning_member_details = this.earning_member_details.filter((item: any, index: number) => index !== this.earning_member_details.length - 1)
    }
  }
  booking() {
    if (!this.loginUser || !this.loginUser.user_id) {
      this.sharedService.openLoginPopup.next({ login: false });
      return;
    }
    const reqData = this.bookingForm.value;
    if (!reqData.is_student) {
      let validationFailed: boolean = false;
      this.earning_member_details.forEach((element: any, index: number) => {
        if (element.employment_status == '') {
          this.bookingFormError = { message: 'Employment Status - Member ' + (index + 1) + ' field is required.' };
          this.bookingFormResponse = null;
          validationFailed = true;
          return;
        }
        else if (element.employment_status == 'Other' && element.other_status_text == '') {
          this.bookingFormError = { message: 'Employment Other Status - Member ' + (index + 1) + ' field is required.' };
          this.bookingFormResponse = null;
          validationFailed = true;
          return;
        }
        else if (element.grass_annual_income == '') {
          this.bookingFormError = { message: 'Gross Annual Income - Member ' + (index + 1) + ' field is required.' };
          this.bookingFormResponse = null;
          validationFailed = true;
          return;
        }
      });
      if (validationFailed) {
        return;
      }
      reqData.earning_member_details = this.earning_member_details;
    }
    else {
      reqData.no_of_earning_members = 0;
    }
    reqData.is_student = reqData.is_student ? 1 : 0;
    reqData.lease_start_date = this.datePipe.transform(reqData.lease_start_date, 'yyyy-MM-dd')
    this.apiService.post(environment.baseURL + ApiEndpoints.longTermProperty.BOOKING, reqData).subscribe(
      (res: any) => {
        this.bookingFormResponse = res;
        this.bookingFormError = null
      },
      (error) => {
        this.bookingFormError = error
        this.bookingFormResponse = null;
        console.log(error);
        if (error.error.lease_duration) {
          this.bookingForm.controls['lease_duration'].setErrors({
            incorrect: error.error.lease_duration,
          });
        }
        if (error.error.lease_start_date) {
          this.bookingForm.controls['lease_start_date'].setErrors({
            incorrect: error.error.lease_start_date,
          });
        }
        if (error.error.no_of_occupants) {
          this.bookingForm.controls['no_of_occupants'].setErrors({
            incorrect: error.error.no_of_occupants,
          });
        }
        if (error.error.no_of_earning_members) {
          this.bookingForm.controls['no_of_earning_members'].setErrors({
            incorrect: error.error.no_of_earning_members,
          });
        }
      });
  }





  ngOnDestroy(): void {
    this.subscription && this.subscription.unsubscribe();
  }

}
