import { DatePipe } from '@angular/common';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { MapMarker, MapInfoWindow } from '@angular/google-maps';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { OwlCarousel } from 'ngx-owl-carousel';
import { Subscription } from 'rxjs';
import { COUNTRY_CODES, Credit_Score_List, Earning_Member_Status, leaseDurations, ROLE, TIME } from 'src/app/app.constants';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/shared/service/api.service';
import { SharedService } from 'src/shared/service/shared.service';
import { ApiEndpoints } from 'src/shared/utils/api-url';

@Component({
  selector: 'app-long-term-booking-request-details',
  templateUrl: './long-term-booking-request-details.component.html',
  styleUrls: ['./long-term-booking-request-details.component.css']
})

export class LongTermBookingRequestDetailsComponent implements OnInit, OnDestroy {
  subscription: Subscription;
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
  loginUser: any;
  userCurrentlySelectedRole: any;
  booking: any;
  //Request Details
  requestStep: number = 1;
  rejectOptions: any = ['Not available', 'Not interested in students', 'Other']
  reject_reason: string;
  reject_reason_text: string;
  rejectResponse: any;
  rejectError: any;

  schedule_obj: any = { showing_date: '', time_from: '', time_to: '', showing_mode: '' }
  schedule_obj_details: any = [{ ...this.schedule_obj }];

  timeOptions: any = TIME;
  scheduleViewOptions: any = ['In Person', 'Virtual', 'Zoom Meeting']
  scheduleResponse: any;
  scheduleError: any;

  showing_id: any;
  showingscheduleResponse: any;
  showingscheduleError: any;
  showing_schedule_appointment: boolean = false;

  rescheduleOptions: any = ['Demo 1', 'Demo 2', 'Other']
  reschedule_reason: string;
  reschedule_reason_text: string;
  rescheduleResponse: any;
  rescheduleError: any;

  tenantActive: boolean;
  toTimeOptions: any;
  responseMsg: any;
  errorMsg: null;
  showing_schedule_appointment_object: any;
  feedback: any;
  bookingStep: any;


  verification_obj: any;
  verification_obj_details: FormGroup;

  earning_member_status: any = Earning_Member_Status;
  earning_member_detail_obj: any = {
    employment_status: '',
    other_status_text: '',
    grass_annual_income: ''
  }
  @ViewChild('add_memberModalCloseButton') addMemberModelCloseButton: ElementRef;
  @ViewChild('activeMemberTab0') memberTabActiveButton: ElementRef;
  verification_charges: number;
  bookingStepLastActive: any;
  verification_fixed_charges: any;
  countryCodes: any;
  public RentalForm: FormGroup;
  //payment
  verification_obj_details_list: any[];
  creditScoreList: any = Credit_Score_List;
  steps: any = 1;
  checked: boolean;
  earlypossesion = false;
  addtional = false;
  addPhotos = false;
  parking = false;
  furnishing = false;
  rent = false;
  formsPayment = false;
  RentIncrease = false;
  securityDeposit = false;
  guarantorInformation = false;
  pets = false;
  petDeposit = false;
  utilitiesDetails = false;
  maintenance = false;
  insurance = false;
  latePayments = false;
  landlordImprovements = false;
  renewal = false;
  submit = false;
  propertyManagement = false;
  notices = false;
  rent1 = false;
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
    this.verification_obj = {
      earning_member_id: [''],
      member_name: ['', [Validators.required]],
      member_email: ['', [Validators.required, Validators.email]],
      member_phone_code: ['+91', [Validators.required]],
      member_phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      university_name: [''],
      course_name: [''],
      course_duration: [''],
      loggedin_user: [false],
      govt_id_proof: ['', [Validators.required]],
      bank_statement: ['', [Validators.required]],
      photo_upload_lease_agreement: ['', [Validators.required]],
      pay_slip: [''],
      credit_score: [''],
      credit_report: [''],
      landlord_references_1_name: ['', [Validators.required]],
      landlord_references_1_code: ['+91', [Validators.required]],
      landlord_references_1_phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      landlord_references_1_email: ['', [Validators.required, Validators.email]],
      landlord_references_2_name: ['', [Validators.required]],
      landlord_references_2_code: ['+91', [Validators.required]],
      landlord_references_2_phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      landlord_references_2_email: ['', [Validators.required, Validators.email]],
      personal_references_1_name: ['', [Validators.required]],
      personal_references_1_code: ['+91', [Validators.required]],
      personal_references_1_phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      personal_references_1_email: ['', [Validators.required, Validators.email]],
      personal_references_2_name: ['', [Validators.required]],
      personal_references_2_code: ['+91', [Validators.required]],
      personal_references_2_phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      personal_references_2_email: ['', [Validators.required, Validators.email]]
    };
    this.verification_obj_details = this.formBuilder.group({
      colease_doc_share_authority: [],
      sharePersonalDetailsWithLandlord: [false, [Validators.requiredTrue]],
      perLesseeCharged: [false, [Validators.requiredTrue]]
    });

  }

  ngOnInit(): void {    
    this.loginUser = this.sharedService.getUserDetails()
    this.userCurrentlySelectedRole = localStorage.getItem(ROLE);
    this.tenantActive = true;
    this.toTimeOptions = []
    this.verification_charges = 0;
    this.countryCodes = COUNTRY_CODES;
    this.subscription = this.activatedRoute.params.subscribe((params: Params) => {
      let id = params['id'];
      this.getBookingRequestDetail(atob(id), 0);
    });
    this.verification_obj_details_list = []
    console.log(this.verification_obj_details);
    // this.stepper();
  }

  getBookingRequestDetail(request_id: string, state: number) {
    const body: object = {
      request_id: request_id,
      user_id: this.loginUser.user_id,
      user_type: this.userCurrentlySelectedRole
    }
    this.apiService.post(environment.baseURL + ApiEndpoints.longTermProperty.GET_BOOKING_REQUEST_DETAIL, body).subscribe(
      (res: any) => {
        const data = res.data[0];
        this.booking = data;

        //booking steps
        const steps = data.request_completed_steps.split(/[\s,]+/);
        this.bookingStepLastActive = steps[steps.length - 1];
        this.bookingStep = steps[steps.length - 1];
        if (this.bookingStep == 1) {
          this.requestStep = 1;

          //tenant active
          if (data.request_status == 2) {
            this.tenantActive = false;
          }

          //check appoinment
          if (data.showing_schedule.length > 0) {
            this.tenantActive = false;
            data.showing_schedule.forEach((element: any) => {
              if (element.date_selected_for_showing) {
                this.showing_schedule_appointment = true;
                this.showing_id = element.showing_id;
                this.showing_schedule_appointment_object = element;
              }
            });
          }
        }
        else if (this.bookingStep == 2) {
          data.earning_member.forEach((element: any, i: number) => {

            this.verification_obj_details.addControl('Member_' + (i + 1), this.formBuilder.group(this.verification_obj));
            this.verification_obj_details_list.push('Member_' + (i + 1));
            this.verification_obj_details.get('Member_' + (i + 1))?.patchValue({
              earning_member_id: element.earning_member_id,
              loggedin_user: element.loggedin_user ? true : false,
              member_name: element.loggedin_user ? this.loginUser.firstname + ' ' + this.loginUser.lastname : element.member_name,
              member_email: element.loggedin_user ? this.loginUser.email : element.member_email,
              member_phone_code: element.loggedin_user ? this.loginUser.dialing_code : '+91',
              member_phone: element.loggedin_user ? this.loginUser.mobile : element.member_phone
            });

            if (element.employment_status == 'Salaried' || element.employment_status == 'Self Employed' || element.employment_status == 'Other') {

              this.verification_obj_details.get('Member_' + (i + 1))?.get('credit_score')?.addValidators([Validators.required]);
              this.verification_obj_details.get('Member_' + (i + 1))?.get('credit_report')?.addValidators([Validators.required]);
              this.verification_obj_details.get('Member_' + (i + 1))?.get('pay_slip')?.addValidators([Validators.required]);
            }
            else {
              this.verification_obj_details.get('Member_' + (i + 1))?.get('pay_slip')?.disable();
            }
          });

          if (!data.verification_payment_status) {
            this.verificationAmountCalculation();
          }
          if (data.co_owners_count > 0) {
            this.verification_obj_details.controls['colease_doc_share_authority'].addValidators([Validators.requiredTrue]);
          }
        }
        if (!state) {
          this.getPropertyDetails(data.requested_property.pro_slug);
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
  getPropertyDetails(pro_slug: any) {
    this.center = {};
    const body: object = {
      pro_slug: pro_slug,
      user_id: this.loginUser.user_id
    }
    this.apiService.post(environment.baseURL + ApiEndpoints.longTermProperty.PROPERTY_DETAIL, body).subscribe(
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








  //Request detail step

  back() {
    this.requestStep = 1;
  }
  reject() {
    this.requestStep = 2;
  }
  rejectSubmit() {
    const reqData = {
      user_id: this.loginUser.user_id,
      user_type: this.userCurrentlySelectedRole,
      request_id: this.booking.request_id,
      reject_reason: this.reject_reason,
      reject_reason_text: this.reject_reason_text
    };

    this.apiService.post(environment.baseURL + ApiEndpoints.longTermProperty.REJECT, reqData).subscribe(
      (res: any) => {
        this.rejectResponse = res;
        this.rejectError = null
        this.getBookingRequestDetail(this.booking.request_id, 1)
      },
      (error) => {
        this.rejectError = error
        this.rejectResponse = null;
        console.log(error);
      });
  }
  scheduleShowing() {
    this.requestStep = 3;
  }
  addSchedule() {
    if (this.schedule_obj_details.length < 3)
      this.schedule_obj_details.push({ ...this.schedule_obj })
  }
  removeSchedule(i: number) {
    this.schedule_obj_details = this.schedule_obj_details.filter((item: any, index: number) => index !== i)
  }
  onChangeFromTime(value: string, i: number) {
    this.scheduleError = null;
    let element: any;
    let toArray: any = []
    let index = TIME.findIndex((item: any) => item.value == value)
    if (index === TIME.length - 1) {
      element = TIME[0];
      toArray = [TIME[0], TIME[1]]
    }
    else {
      element = TIME[index + 1];
      toArray = [TIME[index + 1], TIME[index + 2]]
    }
    this.toTimeOptions[i] = toArray;
    this.schedule_obj_details[i].time_to = element.value;
  }
  onChangeToTime(value: string, i: number) {
    this.scheduleError = null;
    let time_from_index = TIME.findIndex((item: any) => item.value == this.schedule_obj_details[i].time_from);
    let time_to_index = TIME.findIndex((item: any) => item.value == value);

    if (time_from_index === TIME.length - 1) {
      if (time_to_index == 0 || time_to_index == 1) {
      }
      else {
        this.scheduleError = { message: 'Incorrect schedule To Time, You can select only 1 or 2 hour slot.' };
        this.schedule_obj_details[i].time_to = '';
      }
    }
    else {
      if (time_from_index + 1 == time_to_index) {
      }
      else if (time_from_index + 2 == time_to_index) {
      }
      else {
        this.scheduleError = { message: 'Incorrect schedule To Time, You can select only 1 or 2 hour slot.' };
        this.schedule_obj_details[i].time_to = '';
      }
    }
  }
  scheduleShowingSubmit() {
    let validationFailed: boolean = false;
    this.schedule_obj_details.forEach((element: any, index: number) => {

      if (element.showing_date == '') {
        this.scheduleError = { message: 'Schedule date ' + (index + 1) + ' field is required.' };
        this.scheduleResponse = null;
        validationFailed = true;
        return;
      }
      else {
        element.showing_date = this.datePipe.transform(element.showing_date, 'yyyy-MM-dd')
      }

      if (element.time_from == '') {
        this.scheduleError = { message: 'Schedule From Time ' + (index + 1) + ' field is required.' };
        this.scheduleResponse = null;
        validationFailed = true;
        return;
      }
      else if (element.time_to == '') {
        this.scheduleError = { message: 'Schedule To Time ' + (index + 1) + ' field is required.' };
        this.scheduleResponse = null;
        validationFailed = true;
        return;
      }
      else if (element.showing_mode == '') {
        this.scheduleError = { message: 'Schedule showing mode ' + (index + 1) + ' field is required.' };
        this.scheduleResponse = null;
        validationFailed = true;
        return;
      }
      else {
        this.scheduleError = null;
      }
    });
    if (validationFailed) {
      return;
    }
    const reqData = {
      user_id: this.loginUser.user_id,
      user_type: this.userCurrentlySelectedRole,
      request_id: this.booking.request_id,
      showing_schedule: this.schedule_obj_details
    };

    this.apiService.post(environment.baseURL + ApiEndpoints.longTermProperty.SCHEDULE, reqData).subscribe(
      (res: any) => {
        this.scheduleResponse = res;
        this.scheduleError = null;
        this.getBookingRequestDetail(this.booking.request_id, 1)
      },
      (error) => {
        this.scheduleError = error
        this.scheduleResponse = null;
        console.log(error);
      });
  }
  bookAppointment() {
    const reqData = {
      user_id: this.loginUser.user_id,
      user_type: this.userCurrentlySelectedRole,
      request_id: this.booking.request_id,
      showing_id: this.showing_id
    };

    this.apiService.post(environment.baseURL + ApiEndpoints.longTermProperty.SCHEDULE_SHOW, reqData).subscribe(
      (res: any) => {
        this.showingscheduleResponse = res;
        this.showingscheduleError = null;
        this.getBookingRequestDetail(this.booking.request_id, 1);
      },
      (error) => {
        this.showingscheduleError = error
        this.showingscheduleResponse = null;
        console.log(error);
      });
  }
  reschedule() {
    this.requestStep = 4;

  }
  rescheduleSubmit() {
    const reqData = {
      user_id: this.loginUser.user_id,
      user_type: this.userCurrentlySelectedRole,
      request_id: this.booking.request_id,
      reschedule_showing_reason: this.reschedule_reason,
      reschedule_showing_reason_text: this.reschedule_reason_text,
    };

    this.apiService.post(environment.baseURL + ApiEndpoints.longTermProperty.RESCHEDULE, reqData).subscribe(
      (res: any) => {
        this.rescheduleResponse = res;
        this.rescheduleError = null;
        this.getBookingRequestDetail(this.booking.request_id, 1);
      },
      (error) => {
        this.rescheduleError = error
        this.rescheduleResponse = null;
        console.log(error);
      });
  }
  propertyViewingConfirmation() {
    const reqData = {
      user_id: this.loginUser.user_id,
      user_type: this.userCurrentlySelectedRole,
      request_id: this.booking.request_id,
      showing_id: this.showing_id
    };

    this.apiService.post(environment.baseURL + ApiEndpoints.longTermProperty.CONFIRMATION, reqData).subscribe(
      (res: any) => {
        this.responseMsg = res.message;
        this.errorMsg = null;
        this.getBookingRequestDetail(this.booking.request_id, 1);
      },
      (error) => {
        this.errorMsg = error.message;
        this.responseMsg = null;
        console.log(error);
      });
  }
  completion() {
    const reqData = {
      user_id: this.loginUser.user_id,
      user_type: this.userCurrentlySelectedRole,
      request_id: this.booking.request_id,
      request_completed_steps: this.feedback
    };

    this.apiService.post(environment.baseURL + ApiEndpoints.longTermProperty.COMPLETION, reqData).subscribe(
      (res: any) => {
        this.errorMsg = null;
        this.getBookingRequestDetail(this.booking.request_id, 1);
      },
      (error) => {
        this.errorMsg = error.message;
        console.log(error);
      });
  }






  //verification step
  verificationSubmit() {
    let members: any[] = [];
    const data = this.verification_obj_details.value;
    this.verification_obj_details_list.forEach((m: any, i: number) => {
      if (data.hasOwnProperty(m)) {
        const e = data[m];
        const landlord = [{
          name: e.landlord_references_1_name,
          email: e.landlord_references_1_email,
          code: e.landlord_references_1_code,
          phone: e.landlord_references_1_phone,
        },
        {
          name: e.landlord_references_2_name,
          email: e.landlord_references_2_email,
          code: e.landlord_references_2_code,
          phone: e.landlord_references_2_phone,
        }]
        const personal = [{
          name: e.personal_references_1_name,
          email: e.personal_references_1_email,
          code: e.personal_references_1_code,
          phone: e.personal_references_1_phone,
        },
        {
          name: e.personal_references_2_name,
          email: e.personal_references_2_email,
          code: e.personal_references_2_code,
          phone: e.personal_references_2_phone,
        }]
        members.push({
          earning_member_id: e.earning_member_id,
          member_name: e.member_name,
          member_email: e.member_email,
          member_phone_code: e.member_phone_code,
          member_phone: e.member_phone,
          landlord_references:landlord,
          personal_references:personal,
          bank_statement: e.bank_statement,
          credit_report: e.credit_report,
          credit_score: e.credit_score,
          govt_id_proof: e.govt_id_proof,
          loggedin_user: e.loggedin_user ? 1 : 0,
          pay_slip: e.pay_slip,
          photo_upload_lease_agreement: e.photo_upload_lease_agreement
        })
      }
    });
    const reqData = {
      user_id: this.loginUser.user_id,
      user_type: this.userCurrentlySelectedRole,
      request_id: this.booking.request_id,
      member_details: members,
      colease_doc_share_authority: data.colease_doc_share_authority ? 1 :0,
      perLesseeCharged:data.perLesseeCharged ? 1 : 0,
      sharePersonalDetailsWithLandlord: data.sharePersonalDetailsWithLandlord ? 1 : 0
    };
    console.log(reqData);
    this.apiService.post(environment.baseURL + ApiEndpoints.longTermProperty.VERIFICATION, reqData).subscribe(
      (res: any) => {
        this.responseMsg = res.message;
        this.errorMsg = null;
        this.getBookingRequestDetail(this.booking.request_id, 1);
      },
      (error) => {
        this.errorMsg = error.message;
        this.responseMsg = null;
        console.log(error);
      });
  }
  verificationAmountCalculation() {
    const reqData = {
      user_id: this.loginUser.user_id,
      user_type: this.userCurrentlySelectedRole,
      request_id: this.booking.request_id,
    };
    this.apiService.post(environment.baseURL + ApiEndpoints.longTermProperty.VERIFICATION_AMOUNT, reqData).subscribe(
      (res: any) => {
        this.errorMsg = null;
        this.verification_charges = res.charges;
        this.verification_fixed_charges = res.fixed_charges;
      },
      (error) => {
        this.errorMsg = error.message;
        console.log(error);
      });
  }
  async selectDocument(event: any, i: number, type: string) {
    if (event.target.files.length > 0) {
      const res = await this.fileUpload(event.target.files[0]);
      this.verification_obj_details.get('Member_' + (i + 1))?.patchValue({
        [type]: res && res.status ? res.data : ''
      })
    }
  }
  async fileUpload(file: any) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", this.loginUser.user_id);
    const uploadResponse: any = await this.apiService.postPromise(environment.baseURL + ApiEndpoints.longTermProperty.FILE_UPLOAD, formData);
    return uploadResponse;
  }
  removeImage(i: number, type: string) {
    this.verification_obj_details.get('Member_' + (i + 1))?.patchValue({ [type]: '' })
  }
  addMemberFormSubmit() {
    const reqData = {
      user_id: this.loginUser.user_id,
      user_type: this.userCurrentlySelectedRole,
      request_id: this.booking.request_id,
      ...this.earning_member_detail_obj
    };
    this.apiService.post(environment.baseURL + ApiEndpoints.longTermProperty.ADD_EARNING_MEMBER, reqData).subscribe(
      (res: any) => {
        this.responseMsg = res.message;
        this.errorMsg = null;
        if (res.status) {
          this.booking.earning_member.push(res.data);
          const count: number = this.verification_obj_details_list.length;
          this.verification_obj_details.addControl('Member_' + (count + 1), this.formBuilder.group(this.verification_obj));
          this.verification_obj_details_list.push('Member_' + (count + 1));
          this.verification_obj_details.get('Member_' + (count + 1))?.patchValue({ earning_member_id: res.data.earning_member_id, })
          this.verification_charges = res.charges;
          setTimeout(() => {
            this.responseMsg = null;
            this.addMemberModelCloseButton?.nativeElement?.click();
            this.earning_member_detail_obj = {
              employment_status: '',
              other_status_text: '',
              grass_annual_income: ''
            }
          }, 1000);
        }
      },
      (error) => {
        this.errorMsg = error.message;
        this.responseMsg = null;
        console.log(error);
      });
  }
  addMemberFormDisable() {
    if (!this.earning_member_detail_obj.employment_status) {
      return true;
    }
    else if (this.earning_member_detail_obj.employment_status == 'Other' && !this.earning_member_detail_obj.other_status_text) {
      return true;
    }
    else if (!this.earning_member_detail_obj.grass_annual_income) {
      return true;
    }
    else {
      return false;
    }
  }
  removeMember(id: any, formGroup: any) {
    const reqData = {
      user_id: this.loginUser.user_id,
      user_type: this.userCurrentlySelectedRole,
      request_id: this.booking.request_id,
      earning_member_id: id,
    };
    this.apiService.post(environment.baseURL + ApiEndpoints.longTermProperty.REMOVE_EARNING_MEMBER, reqData).subscribe(
      (res: any) => {
        this.responseMsg = res.message;
        this.errorMsg = null;
        if (res.status) {
          this.verification_obj_details_list = this.verification_obj_details_list.filter((item: any) => item != formGroup);
          this.verification_obj_details.removeControl(formGroup);
          this.booking.earning_member = this.booking.earning_member.filter((item: any) => item.earning_member_id !== id);
          this.memberTabActiveButton?.nativeElement?.click();
          this.verification_charges = res.charges;
          setTimeout(() => {
            this.responseMsg = null;
          }, 1000);
        }
      },
      (error) => {
        this.errorMsg = error.message;
        this.responseMsg = null;
        console.log(error);
      });
  }
  isLoginUser(target: any) {
    const reqData = {
      user_id: this.loginUser.user_id,
      user_type: this.userCurrentlySelectedRole,
      request_id: this.booking.request_id,
      earning_member_id: this.verification_obj_details.get('Member_1')?.get('earning_member_id')?.value,
      loggedin_user: target.checked ? 1 : 0
    };
    this.apiService.post(environment.baseURL + ApiEndpoints.longTermProperty.VERIFY_LOGGEDIN_USER, reqData).subscribe(
      (res: any) => {
        this.errorMsg = null;
        if (res.status) {
          this.verification_obj_details.get('Member_1')?.patchValue({
            loggedin_user: target.checked ? true : false,
            member_name: target.checked ? this.loginUser.firstname + ' ' + this.loginUser.lastname : '',
            member_email: target.checked ? this.loginUser.email : '',
            member_phone_code: target.checked ? this.loginUser.dialing_code : '+91',
            member_phone: target.checked ? this.loginUser.mobile : ''
          });
          this.verification_charges = res.charges;
        }
        else {
          target.checked = !target.checked
        }
      },
      (error) => {
        this.errorMsg = error.message;
        console.log(error);
        target.checked = !target.checked
      });
  }
  isSameMember1(target: any, type: any, i: number) {
    if (type == 'landlord') {
      this.verification_obj_details.get('Member_' + (i + 1))?.patchValue({
        landlord_references_1_name: target.checked ? this.verification_obj_details.get('Member_1')?.get('landlord_references_1_name')?.value : '',
        landlord_references_1_code: target.checked ? this.verification_obj_details.get('Member_1')?.get('landlord_references_1_code')?.value : '+91',
        landlord_references_1_phone: target.checked ? this.verification_obj_details.get('Member_1')?.get('landlord_references_1_phone')?.value : '',
        landlord_references_1_email: target.checked ? this.verification_obj_details.get('Member_1')?.get('landlord_references_1_email')?.value : '',
        landlord_references_2_name: target.checked ? this.verification_obj_details.get('Member_1')?.get('landlord_references_2_name')?.value : '',
        landlord_references_2_code: target.checked ? this.verification_obj_details.get('Member_1')?.get('landlord_references_2_code')?.value : '+91',
        landlord_references_2_phone: target.checked ? this.verification_obj_details.get('Member_1')?.get('landlord_references_2_phone')?.value : '',
        landlord_references_2_email: target.checked ? this.verification_obj_details.get('Member_1')?.get('landlord_references_2_email')?.value : ''
      });
    }
    else {
      this.verification_obj_details.get('Member_' + (i + 1))?.patchValue({
        personal_references_1_name: target.checked ? this.verification_obj_details.get('Member_1')?.get('personal_references_1_name')?.value : '',
        personal_references_1_code: target.checked ? this.verification_obj_details.get('Member_1')?.get('personal_references_1_code')?.value : '+91',
        personal_references_1_phone: target.checked ? this.verification_obj_details.get('Member_1')?.get('personal_references_1_phone')?.value : '',
        personal_references_1_email: target.checked ? this.verification_obj_details.get('Member_1')?.get('personal_references_1_email')?.value : '',
        personal_references_2_name: target.checked ? this.verification_obj_details.get('Member_1')?.get('personal_references_2_name')?.value : '',
        personal_references_2_code: target.checked ? this.verification_obj_details.get('Member_1')?.get('personal_references_2_code')?.value : '+91',
        personal_references_2_phone: target.checked ? this.verification_obj_details.get('Member_1')?.get('personal_references_2_phone')?.value : '',
        personal_references_2_email: target.checked ? this.verification_obj_details.get('Member_1')?.get('personal_references_2_email')?.value : ''
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription && this.subscription.unsubscribe();
  }
  stepper(step: any) {
    if (step <= this.bookingStepLastActive) {
      this.bookingStep = step;
      this.responseMsg = null;
      this.errorMsg = null;
    }
  }

  removeAlertMsg() { }

  next(stepNumber: any){
    this.steps = stepNumber;
  }

  previous(stepNumber: any){
    this.steps = stepNumber;
  }

  skip(stepNumber : any){
    this.steps = stepNumber;
  }

  saveForm(){}

  securityDeposit1 = false;
  useOfProperty = false;
  toggleButton(e:any){
    if (e === 'early')
      if (this.earlypossesion) {
        this.earlypossesion = false;
      } else {
        this.earlypossesion = true;
      }
    if (e === 'additional')
      if (this.addtional) {
        this.addtional = false;
      }else{
        this.addtional = true;
      }

    if(e === 'addPhotos'){
      if (this.addPhotos) {
        this.addPhotos = false;
      }else{
        this.addPhotos = true;
      }
    }
    if(e === 'parking'){
      if (this.parking) {
        this.parking = false;
      }else{
        this.parking = true;
      }
    }
    if(e === 'furnishing'){
      if (this.furnishing) {
        this.furnishing = false;
      }else{
        this.furnishing = true;
      }
    }
    if(e === 'rent'){
      if (this.rent) {
        this.rent = false;
      }else{
        this.rent = true;
      }
    }
    if(e === 'formsPayment'){
      if (this.formsPayment) {
        this.formsPayment = false;
      }else{
        this.formsPayment = true;
      }
    }
    if(e === 'RentIncrease'){
      if (this.RentIncrease) {
        this.RentIncrease = false;
      }else{
        this.RentIncrease = true;
      }
    }
    if(e === 'securityDeposit'){
      if (this.securityDeposit) {
        this.securityDeposit = false;
      }else{
        this.securityDeposit = true;
      }
    }
    if(e === 'securityDeposit1'){
      if (this.securityDeposit1) {
        this.securityDeposit1 = false;
      }else{
        this.securityDeposit1 = true;
      }
    }
    if(e === 'guarantorInformation'){
      if (this.guarantorInformation) {
        this.guarantorInformation = false;
      }else{
        this.guarantorInformation = true;
      }
    }
    if(e === 'pets'){
      if (this.pets) {
        this.pets = false;
      }else{
        this.pets = true;
      }
    }
    if(e === 'petDeposit'){
      if (this.petDeposit) {
        this.petDeposit = false;
      }else{
        this.petDeposit = true;
      }
    }
    if(e === 'useOfProperty'){
      if (this.useOfProperty) {
        this.useOfProperty = false;
      }else{
        this.useOfProperty = true;
      }
    }
    if(e === 'utilitiesDetails'){
      if (this.utilitiesDetails) {
        this.utilitiesDetails = false;
      }else{
        this.utilitiesDetails = true;
      }
    }
    if(e === 'maintenance'){
      if (this.maintenance) {
        this.maintenance = false;
      }else{
        this.maintenance = true;
      }
    }
    if(e === 'insurance'){
      if (this.insurance) {
        this.insurance = false;
      }else{
        this.insurance = true;
      }
    }
    if(e === 'latePayments'){
      if (this.latePayments) {
        this.latePayments = false;
      }else{
        this.latePayments = true;
      }
    }
    if(e === 'landlordImprovements'){
      if (this.landlordImprovements) {
        this.landlordImprovements = false;
      }else{
        this.landlordImprovements = true;
      }
    }
    if(e === 'renewal'){
      if (this.renewal) {
        this.renewal = false;
      }else{
        this.renewal = true;
      }
    }
    if(e === 'submit'){
      if (this.submit) {
        this.submit = false;
      }else{
        this.submit = true;
      }
    }
    if(e === 'propertyManagement'){
      if (this.propertyManagement) {
        this.propertyManagement = false;
      }else{
        this.propertyManagement = true;
      }
    }
    if(e === 'notices'){
      if (this.notices) {
        this.notices = false;
      }else{
        this.notices = true;
      }
    }
    if(e === 'rent1'){
      if (this.rent1) {
        this.rent1 = false;
      }else{
        this.rent1 = true;
      }
    }
  }
  legalInput = true;
  pets1 = true;
  buttonClick(e: any){
    if(e === 'min'){
      this.legalInput = false;
    } else if(e === 'max'){
      this.legalInput = true;
    }

    if(e === 'Yes'){
      this.pets1 = true;
    } else if(e === 'No'){
      this.pets1 = false;
    }
  }

}
