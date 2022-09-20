import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/shared/service/shared.service';
import { ApiService } from 'src/shared/service/api.service';
import { ApiEndpoints } from 'src/shared/utils/api-url';
import { timezoneCanada } from 'src/shared/utils/timezone';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { error } from '@angular/compiler/src/util';
import { LongTermPropertyService } from '../long-term-property-listing.service';

@Component({
  selector: 'app-property-address',
  templateUrl: './property-address.component.html',
  styleUrls: ['./property-address.component.css'],
})
export class PropertyAddressComponent implements OnInit {
  propertyAddressForm: FormGroup;
  timezoneValues = timezoneCanada;
  latitude: any;
  longitude: any;
  currentLength = 0;
  center: any;
  saveNExit: boolean = false;
  isEdit: boolean = false;
  errorMsg: any;

  constructor(
    private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private proListingService: LongTermPropertyService
  ) {
    this.propertyAddressForm = this.formBuilder.group({
      pro_title: ['', Validators.required],
      google_address: [''],
      address1: ['', Validators.required],
      address2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postal_code: ['', Validators.required],
      country_region: ['', Validators.required],
      timezone: ['', Validators.required],
    });
  }

  get propertyInfoFormControl() {
    return this.propertyAddressForm.controls;
  }

  async ngOnInit() {
    let pro_id = this.route.snapshot.queryParamMap.get('proId');
    if (pro_id) {
      this.isEdit = true;
      await this.proListingService.getpropertyById(pro_id);
      this.populateFeilds();
    } 
    else {
      this.proListingService.property = null;
    }
    if (!this.isEdit) {
      this.sharedService.getPosition().then((pos) => {
        this.latitude = pos.lat;
        this.longitude = pos.lng;
        this.center = { lat: Number(this.latitude), lng: Number(this.longitude) };
      });
    }
    this.propertyAddressForm.get('pro_title')?.valueChanges.subscribe((val) => {
      this.currentLength = val.length;
    });
  }

  saveAndExit() {
    this.saveNExit = true;
    this.next();
  }

  next() {
    const reqBody = {
      user_id: this.sharedService.getUserDetails().user_id,
      pro_title: this.propertyAddressForm.value.pro_title,
      google_address: this.propertyAddressForm.value.google_address,
      address1: this.propertyAddressForm.value.address1,
      address2: this.propertyAddressForm.value.address2,
      city: this.propertyAddressForm.value.city,
      state: this.propertyAddressForm.value.state,
      postal_code: this.propertyAddressForm.value.postal_code,
      latitude: this.latitude,
      longitude: this.longitude,
      country_region: this.propertyAddressForm.value.country_region,
      timezone: this.propertyAddressForm.value.timezone,
      pro_id: this.proListingService.property?.step_zero?.pro_id,
    };
    
    this.apiService.post(environment.baseURL + ApiEndpoints.longTermProperty.CREATE_PROPERTY, reqBody).subscribe((data: any) => {
        this.errorMsg = null
        this.proListingService.property = data.data;
        let proId = data.data.step_zero.pro_id;
        let url = this.saveNExit ? "host/property-list" : '/host/property-listing/long-term/property-space-type?proId=' + proId;
        if (this.saveNExit) {
          this.proListingService.property = null
        }
        this.router.navigateByUrl(url);
      }, (error: any) => {
        this.errorMsg = error.message
      });
  }

  public handleAddressChange(address: any) {
    this.latitude = address.geometry.location.lat();
    this.longitude = address.geometry.location.lng();
    this.center = { lat: Number(this.latitude), lng: Number(this.longitude) };
    this.propertyAddressForm.patchValue({ address1: "" });
    this.propertyAddressForm.patchValue({ address2: "" });
    let streetNo = "";
    let route = "";
    let al1 = "";
    address.address_components.forEach((e: any) => {
      if (e.types.includes("street_number")) {
        streetNo = e.long_name;
      }
      if (e.types.includes("route")) {
        route = e.long_name;
      }
      if (
        (e.types.indexOf('neighborhood') != -1 &&
          e.types.indexOf('political') != -1) ||
        e.types.indexOf('street_address') != -1 ||
        e.types.indexOf('premise') != -1 ||
        (e.types.indexOf('sublocality_level_3') != -1 &&
          e.types.indexOf('political') != -1 &&
          e.types.indexOf('sublocality') != -1)
      ) {
        al1 = e.long_name;
      }
      if (e.types.indexOf('sublocality_level_1') != -1) {
        this.propertyAddressForm.patchValue({
          address2: e.long_name,
        });
      }
      if (
        e.types.indexOf('country') != -1 ||
        e.types.indexOf('political') != -1
      ) {
        this.propertyAddressForm.patchValue({
          country_region: e.long_name,
        });
      }
      if (e.types.indexOf('postal_code') != -1) {
        this.propertyAddressForm.patchValue({
          postal_code: e.long_name,
        });
      }
      if (e.types.indexOf('administrative_area_level_1') != -1) {
        this.propertyAddressForm.patchValue({
          state: e.long_name,
        });
      }
      if (e.types.indexOf('locality') != -1 && e.types.indexOf('political') != -1) {
        this.propertyAddressForm.patchValue({
          city: e.long_name,
        });
      }
    });
    this.propertyAddressForm.patchValue({
      address1: streetNo + " " + route + " " + al1
    });
  }

  populateFeilds() {
    let data = this.proListingService.property.step_zero;
    this.propertyAddressForm.setValue({
      pro_title: data.pro_title,
      google_address: data.address1,
      address1: data.address1,
      address2: data.address2,
      city: data.city,
      state: data.state,
      postal_code: data.postal_code,
      country_region: data.country_region,
      timezone: data.timezone,
    });
    this.latitude = data.latitude;
    this.longitude = data.longitude;
    this.center = { lat: Number(this.latitude), lng: Number(this.longitude) }
  }
}
