import { DatePipe } from '@angular/common';
import { analyzeAndValidateNgModules, ThrowStmt } from '@angular/compiler';
import { Component, OnInit, HostListener } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router, Params } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/shared/service/api.service';
import { PropertyService } from 'src/shared/service/property.service';
import { SharedService } from 'src/shared/service/shared.service';
import { ApiEndpoints } from 'src/shared/utils/api-url';
import { SearchReqModel } from '../models/reqmodels/reqSearchProperty.model';
import * as CONSTANTS from 'src/app/app.constants';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {
  navbarfixed: boolean = false;
  gridView: boolean = true;
  listView: boolean = false;
  properties: any[] = [];
  category: any[] = [];
  propertyType: any[] = [];
  isPrimaryImage: boolean = false;
  searchRqeData: SearchReqModel = new SearchReqModel()
  reqFields: any = {};
  services: any;
  destination: any;
  startDate: any;
  endDate: any;
  max_additional_guest_allow: any;
  page: number = 1;
  per_page: number = 10;
  total_rec: number = 0;
  displayStyle = "none";
  isFilter: boolean = false;
  showLoadMore: boolean = true;
  sortby: any = false;
  spaceTypeData: any;
  propertyTypeData: any;
  room_type_id: any = [];
  property_type_id: any = [];
  propertyAttributes: any = [];
  searchPropertyForm: FormGroup
  minimumDate: any = "";
  lat: any;
  lng: any;
  metaInfo:any = CONSTANTS.METADATA;

  @HostListener('window:scroll', ['$event']) onscroll() {
    if (window.scrollY > 120) {
      this.navbarfixed = true;
    }
    else {
      this.navbarfixed = false;
    }
  }


  filterPropertyForm: FormGroup = this.formBuilder.group({
    availability: [1],
    spaceType: this.formBuilder.array([]),
    propertyType: this.formBuilder.array([]),
    bedrooms: [1],
    beds: [1],
    baths: [1],
    pricesort: "",
  })

  type: any;
  typeSlug: any;
  title: any;
  description: any;
  minimumDate1: Date;
  datePickerValue: any = [];
  

  constructor(
    private formBuilder: FormBuilder,
    public apiService: ApiService,
    private sharedService: SharedService,
    private router: Router,
    private _propertyService: PropertyService,
    private actRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private titleService: Title,
    private meta: Meta
  ) {
    this.actRoute.params.subscribe((params: Params) => {
      this.type = params['type'];
      this.typeSlug = params['slug'];
      switch (this.type) {
        case "top-destination":
          this.title = "Top Destination";
       //   this.description = "Description"; 
          break;
        case "location":
          this.title = "Location"
          break;
        case "university":
          this.title = "University"
          break;
        default:
          this.title = null
          break;
      }
      let title = '';

      const metadata:any = this.metaInfo.find((item:any) => item.url == this.typeSlug)
      this.titleService.setTitle(metadata.title);
      this.meta.addTags([
        { name: 'description', content: metadata.description },
        // { name: 'keywords', content: metadata.keywords }  
      ]); 
      this.meta.removeTag(
        'description' 
      ); 
    });

    this.searchPropertyForm = this.formBuilder.group({
      destination: [''],
      startAndEndDate: ['', Validators.required],
      // startDate: ['', Validators.required],
      // endDate: ['', Validators.required],
      adults: [1],
      children: [0, Validators.min(0)],
    });
  }


  async ngOnInit() {
    if(this.title && this.typeSlug){
      this.searchPropertyForm.patchValue({ destination: this.typeSlug });
    }
    this.minimumDate1 = new Date();
    this.minimumDate1.setDate(this.minimumDate1.getDate());
    //this.getAmenityAndFacilityName();
    // await this.setFilterValues();
    // this.dropDownInit()
    let today = new Date();
    this.minimumDate = today.toISOString().slice(0, 10);
    // this.searchPropertyForm.get('startDate')?.valueChanges?.subscribe((val:any) => {
    //   //compare value and set other control value
    //   this.getNextDate(val)
    // });
    this.fetchProperties(0);

  }



  getAmenityImage(prop: any) {
    let service = prop.property_amenities.length > 0 ? prop.property_amenities[0] : null;
    if (service && this.services?.length > 0) {
      return environment.imageURL + this.services.find((s: any) => s.service_id == service.service_id).service_image
    }
    return environment.imageURL + '/public/img/services/service staff-1632561241.service-staff.png';
  }

  toggleView(view: string) {
    if (view === "grid") {
      this.gridView = true;
      this.listView = false;
    } else {
      this.gridView = false;
      this.listView = true;
    }
    this.page = 1;
    this.properties = this.properties.splice(0, 10);
    this.isFilter = false;
    this.showLoadMore = true;
  }

  getCoverImage(prop: any) {
    // let image = prop.property_image.find((img:any) => img.is_primary == 1);
    // image = image && (image.file_type = 'image') ? environment.imageURL+"storage/"+image.image : './assets/images/seasrch-result-1.png';
    // return image;
    let image = prop.property_image.find((img: any) => img.is_primary == 1);
    let coverImageData: any = {};
    coverImageData['image_caption'] = image ? image.image_caption : '';
    image = image && (image.file_type = 'image') ? environment.imageURL + "storage/" + image.image : './assets/images/seasrch-result-1.png';
    coverImageData['image'] = image;
    return coverImageData;
  }
  scrolledEvent(params: any) {
    console.log(this.page * this.per_page + "<" + this.total_rec)
    if (this.page * this.per_page < this.total_rec) {
      this.page++;
      this.fetchProperties(1);
    } else {
      this.showLoadMore = false;
    }
  }

  propertySort(e: any) {
    if (e.target.value) {
      this.reqFields.pricesort = e.target.value;
      this.page = 1;
      this.properties = [];
      this.fetchProperties(1);
    }
  }

  // setFilterValues() {
  //   if (this.actRoute.snapshot.queryParamMap.get('destination') != "") {
  //     this.filterPropertyForm.patchValue({ "destination": this.actRoute.snapshot.queryParamMap.get('destination') })
  //   }
  //   if (this.actRoute.snapshot.queryParamMap.get('startDate') != "") {
  //     this.filterPropertyForm.patchValue({ "startDate": this.actRoute.snapshot.queryParamMap.get('startDate') })
  //   }
  //   if (this.actRoute.snapshot.queryParamMap.get('endDate') != "") {
  //     this.filterPropertyForm.patchValue({ "endDate": this.actRoute.snapshot.queryParamMap.get('endDate') })
  //   }
  //   if (this.actRoute.snapshot.queryParamMap.get('availability_for') != "") {
  //     this.filterPropertyForm.patchValue({ "availability_for": this.actRoute.snapshot.queryParamMap.get('availability_for') })
  //   }
  //   if (this.actRoute.snapshot.queryParamMap.get('property_type_id') != "") {
  //     this.property_type_id = this.actRoute.snapshot.queryParamMap.get('property_type_id')?.split(',');
  //   }
  //   if (this.actRoute.snapshot.queryParamMap.get('room_type_id') != "") {
  //     this.room_type_id = this.actRoute.snapshot.queryParamMap.get('room_type_id')?.split(',');
  //   }

  //   if (this.actRoute.snapshot.queryParamMap.get('services') != "") {
  //     this.reqFields.services = this.actRoute.snapshot.queryParamMap.get('services')
  //   }
  // }

  onReqChange(data: any) {
    console.log(data)
    this.reqFields = data;
    this.page = 1
    this.properties = []
    if (this.typeSlug)
      this.reqFields.category_slug = this.typeSlug

    // this.reqFields.room_type_id.join(",")
    // this.reqFields.property_type_id.join(",")
    // this.reqFields={...data,
    //   room_type_id:data.room_type_id.join(","),
    //   property_type_id:data.property_type_id.join(",")}
    this.fetchProperties(1)
  }

  dropDownInit() {
    //jQuery\.noConflict\(\);
    $("#sh").click(() => {
      $(".user-dropdown").toggle();
    })
    $(document).click((e: any) => {
      var hideDrop = $("#drop-div");
      if (!hideDrop.is(e.target) && hideDrop.has(e.target).length === 0) {
        $(".user-dropdown").hide();
      }
    })
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

  getDatePlusOne(date: string): string {
    if (!date) {
      return ""
    }
    let nextDate = new Date(date)
    nextDate.setDate(nextDate.getDate() + 1)
    return nextDate.toISOString().slice(0, 10)
  }

  getNextDate(event: any) {
    let nextDate = new Date(event);
    nextDate.setDate(nextDate.getDate() + 1);
    let dateString = nextDate.toISOString().slice(0, 10);
    this.searchPropertyForm.controls['endDate'].setValue(dateString)
  }

  get searchPropertFormControl() {
    return this.searchPropertyForm.controls
  }

  public handleAddressChange(address: any) {
    this.lat = address.geometry.location.lat();
    this.lng = address.geometry.location.lng();
    this.searchPropertyForm.patchValue({
      destination: address.formatted_address,
    });
  }

  resetLatLng(event: any) {
    this.lat = null;
    this.lng = null;

  }


  fetchProperties(state: any) {
    this.GuestDropDown = false;
    if (state != 'fetchPropertiesForm') {
      this.setParams(state);
    }
    //this.getAmenityAndFacilityName();
    let req = {
      ...this.reqFields,
      room_type_id: this.reqFields.room_type_id?.join(","),
      property_type_id: this.reqFields.property_type_id?.join(",")
    }
    this.apiService.post(environment.baseURL + ApiEndpoints.GET_PROPERTY_LISTS, req).subscribe((data: any) => {

      if (data.status == 1 && (data.data.length == undefined)) {

        let propertiesData = data.data.data.map((prop: any) => {
          prop['coverImageData'] = this.getCoverImage(prop);
          prop['amenityImage'] = this.getAmenityImage(prop);
          this.properties.push(prop);

          // this.properties.push(prop);
          return prop;

        });
        this.total_rec = data.data.total;
      } else {
        this.properties = [];
      }

    }, (error) => {
      this.properties = [];
      console.log(error);

    });

  }
  setParams(state: any) {

    if (this.actRoute.snapshot.queryParamMap.get('destination')) {
      this.reqFields.destination = <string>this.actRoute.snapshot.queryParamMap.get('destination');
      this.searchPropertyForm.patchValue({ destination: this.reqFields.destination });
      this.searchPropertyForm.controls.destination.setValidators([Validators.required]);
    }
    else{
      this.searchPropertyForm.controls.destination.clearValidators();
    }
    this.searchPropertyForm.controls.destination.updateValueAndValidity();











    if (this.actRoute.snapshot.queryParamMap.get('startDate')) {
      this.reqFields.startDate = <string>this.actRoute.snapshot.queryParamMap.get('startDate');
      this.datePickerValue.push(new Date(this.reqFields.startDate))
    }
    if (this.actRoute.snapshot.queryParamMap.get('endDate')) {
      this.reqFields.endDate = <string>this.actRoute.snapshot.queryParamMap.get('endDate');
      this.datePickerValue.push(new Date(this.reqFields.endDate))
      let se: any = [new Date(this.reqFields.startDate), new Date(this.reqFields.endDate)]
      this.searchPropertyForm.patchValue({ startAndEndDate: se });
    }
    if (this.actRoute.snapshot.queryParamMap.get('max_additional_guest_allow')) {
      this.reqFields.max_additional_guest_allow = <string>this.actRoute.snapshot.queryParamMap.get('max_additional_guest_allow');
    }

    if (this.actRoute.snapshot.queryParamMap.get('adults')) {
      this.reqFields.adults = <string>this.actRoute.snapshot.queryParamMap.get('adults');
      this.searchPropertyForm.patchValue({ adults: this.reqFields.adults });
    }

    if (this.actRoute.snapshot.queryParamMap.get('children')) {
      this.reqFields.children = <string>this.actRoute.snapshot.queryParamMap.get('children');
      this.searchPropertyForm.patchValue({ children: this.reqFields.children });
    }

    if (this.actRoute.snapshot.queryParamMap.get('pricesort')) {
      this.reqFields.pricesort = <string>this.actRoute.snapshot.queryParamMap.get('pricesort');
    }

    if (this.actRoute.snapshot.queryParamMap.get('services')) {
      this.reqFields.services = <string>this.actRoute.snapshot.queryParamMap.get('services');
      this.searchPropertyForm.patchValue({ destination: this.reqFields.services });

    }

    if (this.actRoute.snapshot.queryParamMap.get('lat')) {
      this.reqFields.lat = this.actRoute.snapshot.queryParamMap.get('lat');
    }

    if (this.actRoute.snapshot.queryParamMap.get('lng')) {
      this.reqFields.lng = this.actRoute.snapshot.queryParamMap.get('lng');
    }

    if (state == 0) {
      if (this.actRoute.snapshot.queryParamMap.get('distance')) {
        this.reqFields.distance = <string>this.actRoute.snapshot.queryParamMap.get('distance');
      }

      if (this.actRoute.snapshot.queryParamMap.get('room_type_id')) {
        this.reqFields.room_type_id = this.actRoute.snapshot.queryParamMap.get('room_type_id')?.split(',');
      }

      if (this.actRoute.snapshot.queryParamMap.get('property_type_id')) {
        this.reqFields.property_type_id = this.actRoute.snapshot.queryParamMap.get('property_type_id')?.split(',');
        this.searchPropertyForm.patchValue({ destination: this.reqFields.property_type_id });

      }
    }

    this.reqFields.page = this.page;
    this.reqFields.per_page = 10;
    if (this.typeSlug)
      this.reqFields.category_slug = this.typeSlug
  }

  // onChangeDateRangePicker() {
  //   this.reqFields.startDate = this.datePipe.transform(this.datePickerValue[0], 'yyyy-MM-dd');
  //   this.reqFields.endDate = this.datePipe.transform(this.datePickerValue[1], 'yyyy-MM-dd');
  //   this.page = 1
  //   this.properties = []

  //   let updateableParms = {
  //     ...this.reqFields
  //   }
  //   delete updateableParms.page;
  //   delete updateableParms.per_page;
  //   delete updateableParms.category_slug;

  //   this.router.navigate(['.'], { relativeTo: this.actRoute, queryParams: { ...updateableParms } });
  //   setTimeout(() => { this.fetchProperties(1); }, 100);
  // }

  fetchPropertiesForm() {
    if(this.reqFields.destination){
      this.reqFields.destination = this.searchPropertFormControl.destination.value;
    }
    this.reqFields.startDate = this.datePipe.transform(this.searchPropertFormControl.startAndEndDate.value[0], 'yyyy-MM-dd');
    this.reqFields.endDate = this.datePipe.transform(this.searchPropertFormControl.startAndEndDate.value[1], 'yyyy-MM-dd');
    this.reqFields.adults = this.searchPropertFormControl.adults.value;
    this.reqFields.children = this.searchPropertFormControl.children.value;
    this.page = 1
    this.properties = []

    let updateableParms = {
      ...this.reqFields
    }
    delete updateableParms.page;
    delete updateableParms.per_page;
    delete updateableParms.category_slug;



    this.router.navigate(['.'], { relativeTo: this.actRoute, queryParams: { ...updateableParms } });
    setTimeout(() => { this.fetchProperties('fetchPropertiesForm'); }, 100);
  }


  GuestDropDown: boolean = false;
  onClickGuest(event: any) {
    this.GuestDropDown = !this.GuestDropDown;
    event.stopPropagation()
  }

  @HostListener('document:click', ['$event', '$event.target'])
  onClick(event: MouseEvent, targetElement: HTMLElement): void {
    if (targetElement.id == 'GuestDropDownClose' || targetElement.id == 'GuestDropDownClose2' || targetElement.id == 'GuestDropDownClose3') {
      this.GuestDropDown = false;
    }
  }

}
