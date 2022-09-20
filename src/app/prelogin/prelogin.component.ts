import { Component, ElementRef, HostListener, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { PropertyService } from 'src/shared/service/property.service';
import { SearchReqModel } from '../models/reqmodels/reqSearchProperty.model';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/shared/service/api.service';
import { SharedService } from 'src/shared/service/shared.service';
import { ApiEndpoints } from 'src/shared/utils/api-url';
import { HeaderComponent } from '../../shared/component/header/header.component';
import * as CONSTANTS from "src/app/app.constants";
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { leaseDurations } from 'src/app/app.constants';

@Component({
  selector: 'app-prelogin',
  templateUrl: './prelogin.component.html',
  styleUrls: ['./prelogin.component.css']
})
export class PreloginComponent implements OnInit {
  navbarfixed: boolean = false;

  //minimumDate:any="";
  minimumDate: Date;
  searchLongTermPropertyForm: FormGroup;
  leaseDurations: any = leaseDurations;



  imageUrl = environment.imageURL;
  searchRqeData: SearchReqModel = new SearchReqModel()

  searchPropertyForm: FormGroup

  reqFields: any = {};
  topDestinations: Array<any> = []
  masterAmenities: Array<any> = [];
  masterFacilities: Array<any> = [];
  typeOfProperty: Array<any> = [];
  lat: any
  lng: any

  @ViewChild('header', { read: ViewContainerRef }) header: HeaderComponent;

  formGroup: FormGroup;
  submitted: boolean = false;
  @ViewChild('signUpFormButton') signUpFormButton: ElementRef;
  @ViewChild('signUpModelCloseButton') signUpModelCloseButton: ElementRef;


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private _propertyService: PropertyService,
    private apiService: ApiService,
    private sharedService: SharedService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private elRef: ElementRef,
  ) {
  }
  get formGroupControl() {
    return this.formGroup.controls;
  }
  async ngOnInit() {
    if (!sessionStorage.getItem(CONSTANTS.localStorageKeys.signUpModelClose)) {
      this.signUpModelOpen();
    }
    //this.dropDownInit()
    //let today = new Date();
    //this.minimumDate=today.toISOString().slice(0, 10);
    this.minimumDate = new Date();
    this.minimumDate.setDate(this.minimumDate.getDate());

    this.formGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
    });

    this.searchPropertyForm = this.formBuilder.group({
      destination: ['', Validators.required],
      startAndEndDate: ['', Validators.required],
      // startDate: ['', Validators.required],
      // endDate: ['', Validators.required],
      adults: [1, Validators.min(1)],
      children: [0, Validators.min(0)],
    });

    //longterm
    this.searchLongTermPropertyForm = this.formBuilder.group({
      destination: ['', Validators.required],
      minimum_lease_duration: ['', Validators.required],
      maximum_lease_duration: ['', Validators.required],
      lease_start_date: ['', Validators.required],
      no_of_occupants: [1, Validators.min(1)],
      lat: ['', Validators.required],
      lng: ['', Validators.required]
    });





    // this.searchPropertyForm.get('startDate')?.valueChanges?.subscribe((val:any) => {
    //   //compare value and set other control value
    //   this.getNextDate(val)
    // });

    let resp: any = await this.apiService.postSync(environment.baseURL + ApiEndpoints.GET_PROPERTY_TYPES, {});
    resp.data.property_type.forEach((element: any) => {
      if (element.is_home) {
        this.typeOfProperty.push(element)
      }
    });

    this.getTopDestination()
    this.getServicesMasterList()

    // this.searchPropertyForm.get('destination')?.valueChanges.subscribe((val:any) => {
    //   this.lat=null;
    //   this.lng=null;
    // });
  }

  // getNextDate(event:any){
  //   let nextDate = new Date(event);
  //   nextDate.setDate(nextDate.getDate()+1);
  //   let dateString=nextDate.toISOString().slice(0, 10);
  //   this.searchPropertyForm.controls['endDate'].setValue(dateString)
  // }

  getTopDestination() {
    let postData = {
      "category_name": "top-destination",
      "page": "1",
      "per_page": "10"
    }
    this.apiService.post(environment.baseURL + ApiEndpoints.GET_TOP_DESTINATION_BY_CATEGORY, postData).subscribe((data: any) => {
      this.topDestinations = data.data.data
    });
  }
  getServicesMasterList() {
    this.apiService.post(environment.baseURL + ApiEndpoints.SERVICES_MASTER_LIST, {}).subscribe((data) => {
      this.masterAmenities = []
      data.data.amenities_list.forEach((element: any) => {
        if (element.is_home) {
          this.masterAmenities.push(element)
        }
      });
      // this.masterAmenities = data.data.amenities_list;
      // this.masterFacilities = data.data.facilities_list;
    },
      (error) => {
        console.log(error);
      }
    );
  }
  getPropertyList(): void {
    //console.log(this.searchPropertyForm.value);
    if (this.searchPropertyForm.value.destination) {
      this.reqFields.destination = this.searchPropertyForm.value.destination
    }
    if (this.searchPropertyForm.value.startAndEndDate.length == 2) {
      this.reqFields.startDate = this.datePipe.transform(this.searchPropertyForm.value.startAndEndDate[0], 'yyyy-MM-dd')
      this.reqFields.endDate = this.datePipe.transform(this.searchPropertyForm.value.startAndEndDate[1], 'yyyy-MM-dd')
    }

    //  if(this.searchPropertyForm.value.startDate){
    //   this.reqFields.startDate = this.searchPropertyForm.value.startDate
    //   }
    //   if(this.searchPropertyForm.value.endDate){
    //     this.reqFields.endDate = this.searchPropertyForm.value.endDate
    //   }
    // if(this.searchPropertyForm.value.max_additional_guest_allow){
    //   this.reqFields.max_additional_guest_allow = this.searchPropertyForm.value.max_additional_guest_allow
    // }

    if (this.searchPropertyForm.value.children) {
      this.reqFields.children = this.searchPropertyForm.value.children
    }
    if (this.searchPropertyForm.value.adults) {
      this.reqFields.adults = this.searchPropertyForm.value.adults
    }
    if (this.lat) {
      this.reqFields.lat = this.lat
    }
    if (this.lng) {
      this.reqFields.lng = this.lng
    }
    let navigationExtras: NavigationExtras = {
      queryParams: this.reqFields
    };
    this.router.navigate(['/properties'], navigationExtras);
  }
  get searchPropertFormControl() {
    return this.searchPropertyForm.controls
  }
 
  get user() {
    let userStr = localStorage.getItem('userdata') || '{}';
    return JSON.parse(userStr);
  }
  getDatePlusOne(date: string): string {
    if (!date) {
      return ""
    }
    let nextDate = new Date(date)
    nextDate.setDate(nextDate.getDate() + 1)
    return nextDate.toISOString().slice(0, 10)
  }
  resetLatLng(event: any) {
    this.lat = null;
    this.lng = null;
  }
  public handleAddressChange(address: any) {
    this.lat = address.geometry.location.lat();
    this.lng = address.geometry.location.lng();
    this.searchPropertyForm.patchValue({
      destination: address.formatted_address,
    });
  }
  searchByAminity(type: any) {
    this.router.navigateByUrl("/properties?services=" + type)
  }
  searchByProperty(type: any) {
    this.router.navigateByUrl("/properties?property_type_id=" + type)
  }
  openRegister() {
    // debugger
    // this.header.registerPopup()
    if (this.user && (this.user.user_type == CONSTANTS.USER_TYPE.HOST || this.user.user_type == CONSTANTS.USER_TYPE.GUEST_AND_HOST)) {
      this.router.navigateByUrl('/host/property-listing/title')
    } else if (this.user.user_type) {
      this.sharedService.changeRegTypeOrRegister.next({ loginStatus: true })
    } else {
      this.sharedService.openRegisterPopup.next({ loginStatus: false, userType: 2 })
    }
    // this.sharedService.openRegisterPopup.next({ loginStatus: true })
  }
  decrease(setAttrName: string) {
    if (this.searchPropertyForm.controls[setAttrName].value > 0) {
      this.searchPropertyForm.controls[setAttrName].setValue(
        Number(this.searchPropertyForm.value[setAttrName]) - 1
      );
    }
  }
  increase(setAttrName: string) {
    if (this.searchPropertyForm.controls[setAttrName].value < 100) {
      this.searchPropertyForm.controls[setAttrName].setValue(
        Number(this.searchPropertyForm.value[setAttrName]) + 1
      );
    }
  }







  // dropDownInit(){
  //   //jQuery\.noConflict\(\);
  //   $("#sh").click(()=>{
  //     $(".user-dropdown").toggle();
  //   })
  //   $(document).click((e:any)=>{
  //       var hideDrop = $("#drop-div");
  //       if(!hideDrop.is(e.target) && hideDrop.has(e.target).length === 0){
  //         $(".user-dropdown").hide();
  //       }
  //   })
  // }

  GuestDropDown: boolean = false;
  onClickGuest(event: any) {
    this.GuestDropDown = !this.GuestDropDown;
    event.stopPropagation()
  }

  @HostListener('document:click', ['$event', '$event.target'])
  onClick(event: MouseEvent, targetElement: HTMLElement): void {
    if (targetElement.id == 'banner-search' || targetElement.id == 'banner-search-content' || targetElement.id == 'banner-search-container' || targetElement.id == 'banner-search-container-title') {
      this.GuestDropDown = false;
      this.tenantDropDown = false;
    }
  }

  @HostListener('window:scroll', ['$event']) onscroll() {
    if (window.scrollY > 500) {
      this.navbarfixed = true;
    }
    else {
      this.navbarfixed = false;
    }
  }
  

  onSubmit() {
    this.submitted = true;

    if (!this.formGroup.valid) {
      return;
    }

    const reqBody = {
      name: this.formGroup.value.name,
      email: this.formGroup.value.email,
    };
    this.apiService
      .post(environment.baseURL + ApiEndpoints.SUBSCRIBE_HOST_EMAIL, reqBody)
      .subscribe(
        (data: any) => {
          this.toastr.success(data.message);
          this.formGroup.reset()
          this.submitted = false;
          this.signUpModelClose();
          this.router.navigate(['/how-it-works-host'])
        },
        (error) => {
          this.toastr.error(error.message);
        }
      );


  }
  signUpModelOpen() {
    setTimeout(() => {
      this.signUpFormButton?.nativeElement?.click();
    }, 5000);
  }
  signUpModelClose() {
    this.signUpModelCloseButton?.nativeElement?.click();
    sessionStorage.setItem(CONSTANTS.localStorageKeys.signUpModelClose, 'true')
  }



  //longterm
  tenantDropDown: boolean = false;
  get searchLongTermPropertyFormControls() {
    return this.searchLongTermPropertyForm.controls
  }
  handleLongTermAddressChange(address: any) {
    this.searchLongTermPropertyForm.patchValue({
      destination: address.formatted_address,
      lat: address.geometry.location.lat(),
      lng: address.geometry.location.lng()
    });
  }
  decreaseOccupants(): void {
    if (this.searchLongTermPropertyForm.controls.no_of_occupants.value > 0) {
      this.searchLongTermPropertyForm.controls.no_of_occupants.setValue(Number(this.searchLongTermPropertyForm.value.no_of_occupants) - 1
      );
    }
  }
  increaseOccupants(): void {
    if (this.searchLongTermPropertyForm.controls.no_of_occupants.value < 100) {
      this.searchLongTermPropertyForm.controls.no_of_occupants.setValue(Number(this.searchLongTermPropertyForm.value.no_of_occupants) + 1
      );
    }
  }
  onClickTenant(event: any) {
    this.tenantDropDown = !this.tenantDropDown;
    event.stopPropagation()
  }
  getLongTermPropertyList(): void {
    const queryParamsData = this.searchLongTermPropertyForm.value;
    queryParamsData.lease_start_date = this.datePipe.transform(queryParamsData.lease_start_date, 'yyyy-MM-dd')
    const navigationExtras: NavigationExtras = {
      queryParams: queryParamsData
    };
    this.router.navigate(['/properties/long-term'], navigationExtras);
  }
}
