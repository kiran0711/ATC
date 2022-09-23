import { LabelType, Options } from '@angular-slider/ngx-slider';
import { DatePipe } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { leaseDurations, METADATA } from 'src/app/app.constants';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/shared/service/api.service';
import { SharedService } from 'src/shared/service/shared.service';
import { ApiEndpoints } from 'src/shared/utils/api-url';

@Component({
  selector: 'app-long-term',
  templateUrl: './long-term.component.html',
  styleUrls: ['./long-term.component.css']
})
export class LongTermComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  type: any;
  typeSlug: any;
  title: string;
  metaInfo: any = METADATA;
  view: string = 'Grid';
  searchLongTermPropertyForm: any;
  tenantDropDown: boolean = false;
  navbarfixed: boolean = false;
  leaseDurations: any = leaseDurations;
  queryParams: Params;
  page: number = 1;
  perPage: number = 10;
  properties: any[] = [];
  totalRecord: any;
  isFilter: boolean = false;
  showLoadMore: boolean = true;

  spaceTypeData: any;
  propertyTypeData: any;
  request: any = {
    room_type_id: [],
    property_type_id: [],
    distance: 25,
    min_price: 0,
    max_price: 1000
  }
  propertyAttributes: any = [];
  queryParamsForRequest: any;
  distanceApplicable: boolean = false;
  options: Options = {
    floor: 0,
    ceil: 50,
    showTicks: false,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Floor:
          return "";
        default:
          return "" + value + " Km";
      }
    }
  };
  optionsPrice: Options = {
    floor: 0,
    ceil: 1000,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        default:
          return "$" + value + "";
      }
    }
  }

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public sharedService: SharedService,
    private titleService: Title,
    private datePipe: DatePipe,
    private metaService: Meta
  ) {
    this.subscription = new Subscription();
    this.searchLongTermPropertyForm = this.formBuilder.group({
      destination: ['', Validators.required],
      minimum_lease_duration: ['', Validators.required],
      maximum_lease_duration: ['', Validators.required],
      lease_start_date: ['', Validators.required],
      no_of_occupants: [1, Validators.min(1)],
      lat: ['', Validators.required],
      lng: ['', Validators.required]
    });
  }

  get searchLongTermPropertyFormControls() {
    return this.searchLongTermPropertyForm.controls
  }

  ngOnInit(): void {
    this.subscription = this.activatedRoute.params.subscribe((params: Params) => {
      this.type = params['type'];
      this.typeSlug = params['slug'];
      switch (this.type) {
        case "top-destination":
          this.title = "Top Destination";
          break;
        case "location":
          this.title = "Location"
          break;
        case "university":
          this.title = "University"
          break;
        default:
          this.title = ""
          break;
      }
    });
    this.subscription = this.activatedRoute.queryParams.subscribe((queryParams: Params) => {
      if (Object.keys(queryParams).length !== 0) {
        this.searchLongTermPropertyForm.patchValue(queryParams);
        this.searchLongTermPropertyForm.patchValue({lease_start_date: new Date(queryParams.lease_start_date)});
        this.distanceApplicable = queryParams['lat'] != null && queryParams['lng'] != null;
        this.fetchPropertiesForm();
      }
      else{
        this.fetchProperties();
      }
    });
    this.setSEOData();
    this.getPropertyTypes();
  }
  setSEOData(): void {
    if (!this.typeSlug) {
      return
    }
    const metadata: any = this.metaInfo.find((item: any) => item.url == this.typeSlug)
    if (!metadata) {
      return
    }
    this.titleService.setTitle(metadata.title);
    this.metaService.addTags([
      { name: 'description', content: metadata.description },
      { name: 'keywords', content: metadata.keywords }
    ]);
    this.metaService.removeTag(
      'description'
    );
  }



  resetLatLng(event: any) {
    this.searchLongTermPropertyForm.patchValue({
      lat: '',
      lng: ''
    });
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
  @HostListener('document:click', ['$event', '$event.target'])
  onClick(event: MouseEvent, targetElement: HTMLElement): void {
    if (targetElement.id == 'tenantDropDownClose' || targetElement.id == 'tenantDropDownClose2' || targetElement.id == 'tenantDropDownClose3') {
      this.tenantDropDown = false;
    }
  }


  fetchPropertiesForm(): void {
    const formData: any = this.searchLongTermPropertyForm.value;
    formData.lease_start_date = this.datePipe.transform(formData.lease_start_date, 'yyyy-MM-dd');
    this.router.navigate(['.'], { relativeTo: this.activatedRoute, queryParams: formData });
    this.queryParamsForRequest = { ...formData, page: this.page, per_page: this.perPage };
    this.fetchProperties()
  }


  fetchProperties() {
    this.apiService.post(environment.baseURL + ApiEndpoints.longTermProperty.GET_PROPERTY_LISTS, this.queryParamsForRequest).subscribe(
      (res: any) => {
        if (res.status) {
          this.totalRecord = res.data.total;
          this.properties = res.data.data.map((prop: any) => {
            prop['coverImageData'] = this.getCoverImage(prop);
            prop['amenityImage'] = environment.imageURL + '/public/img/services/service staff-1632561241.service-staff.png';
            return prop;
          });
        }
      },
      (error) => {
        console.log(error);
      });
  }


  toggleView() {
    this.view = this.view == 'Grid' ? 'List' : 'Grid';
    this.page = 1;
    this.properties = this.properties.splice(0, 10);
    this.isFilter = false;
    this.showLoadMore = true;
  }
  propertySort(e: any) {
    if (e.target.value) {
      this.queryParamsForRequest['pricesort'] = e.target.value;
      this.queryParamsForRequest.page = this.page = 1;
      this.properties = [];
      this.fetchProperties();
    }
  }
  scrolledEvent() {
    if (this.page * this.perPage < this.totalRecord) {
      this.queryParamsForRequest.page = this.page++;
      this.fetchProperties();
    } else {
      this.showLoadMore = false;
    }
  }
  getCoverImage(prop: any) {
    let image = prop.property_longterm_image.find((img: any) => img.is_primary == 1);
    let coverImageData: any = {};
    coverImageData['image_caption'] = image ? image.image_caption : '';
    image = image && (image.file_type = 'image') ? environment.imageURL + "storage/" + image.image : './assets/images/seasrch-result-1.png';
    coverImageData['image'] = image;
    return coverImageData;
  }


  @HostListener('window:scroll', ['$event']) onscroll() {
    if (window.scrollY > 120) {
      this.navbarfixed = true;
    }
    else {
      this.navbarfixed = false;
    }
  }
  parseFloat(cordinates: any) {
    return parseFloat(cordinates);

  }
  onMouseOver(infoWindow: any, gm: any) {
    if (gm.lastOpen != null) {
      gm.lastOpen.close();
    }
    gm.lastOpen = infoWindow;
    infoWindow.open();
  }





  //filters
  getPropertyTypes() {
    this.apiService.post(environment.baseURL + ApiEndpoints.GET_PROPERTY_TYPES, {}).subscribe((data: any) => {
      this.spaceTypeData = data.data.type_of_space;
      this.propertyTypeData = data.data.property_type;
    });

  }
  onSpaceTypeChanged(e: any) {
    if (this.request.room_type_id.includes(e.target.value)) {
      let index = this.request.room_type_id.indexOf(e.target.value);
      this.request.room_type_id.splice(index, 1);
    } else {
      this.request.room_type_id.push(e.target.value)
    }
    if (this.request.room_type_id && this.request.room_type_id.length) {
      let categoryId = this.request.room_type_id.join(",")
      let req = { category_ids: categoryId, property_term: 1 };
      this.getPropertyAttributeByCat(req);
    } else {
      this.propertyAttributes = []
    }
  }
  getPropertyAttributeByCat(params: any) {
    this.apiService.post(environment.baseURL + ApiEndpoints.GET_ATTRIBUTE_BY_CAT, params, false).subscribe(
      (res) => {
        this.propertyAttributes = []
        res.data.attributes.forEach((element: any) => {
          if (element.is_filter) {
            this.propertyAttributes.push(element)
            if (element.input_type == 'range') {
              this.request[element.attr_key] = element.min_val
            }
          }
        });
      },
      (error) => {

      }
    );

  }
  checkSpaceType(spaceTypeId: any): boolean {
    return this.request.room_type_id.includes(spaceTypeId.toString())
  }
  onPropertyTypeChanged(e: any) {
    if (this.request.property_type_id.includes(e.target.value)) {
      let index = this.request.property_type_id.indexOf(e.target.value);
      this.request.property_type_id.splice(index, 1);
    } else {
      this.request.property_type_id.push(e.target.value)
    }
  }
  checkPropType(propTypeId: any): boolean {
    return this.request.property_type_id.includes(propTypeId.toString())
  }


  clearFilter() {
    this.request = {
      room_type_id: [],
      property_type_id: [],
    }
    this.propertyAttributes = []
  }

  filter() {
    this.queryParamsForRequest = {...this.queryParamsForRequest, ...this.request };
    this.queryParamsForRequest['room_type_id'] = this.request.room_type_id?.join(",");
    this.queryParamsForRequest['property_type_id'] = this.request.property_type_id?.join(",")
    this.fetchProperties();
  }
  increaseCounter(key: string) {
    if (this.request[key] != null) {
      let keyObject = this.propertyAttributes.filter((x: any) => x.attr_key == key)
      if (this.request[key] < keyObject[0].max_val) {
        this.request[key] = ++this.request[key]
      } else {
        this.request[key] = keyObject[0].max_val
      }
    } else {
      let keyObject = this.propertyAttributes.filter((x: any) => x.attr_key == key)
      this.request[key] = keyObject[0].min_val
    }
  }

  decreaseCounter(key: string) {
    if (this.request[key] != null) {
      let keyObject = this.propertyAttributes.filter((x: any) => x.attr_key == key)
      if (this.request[key] != keyObject[0].min_val) {
        this.request[key] = --this.request[key]
      } else {
        this.request[key] = keyObject[0].min_val
      }

    } else {
      let keyObject = this.propertyAttributes.filter((x: any) => x.attr_key == key)
      this.request[key] = keyObject[0].min_val
    }
  }

  attrChange(event: any, key: any) {

    if (!this.request[key]) {
      this.request[key] = event.target.value == 'on' ? true : false;
    } else {
      delete this.request[key]
    }
    console.log(this.request)
  }

  getAttrValue(key: any, type: any) {
    if (this.request[key]) {
      return this.request[key]
    } else if (type = "toggle") {
      return false;
    } else {
      return 0
    }
  }


  ngOnDestroy(): void {
    this.subscription && this.subscription.unsubscribe();
  }

}
