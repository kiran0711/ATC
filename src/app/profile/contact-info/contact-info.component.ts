import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/shared/service/api.service';
import { SharedService } from 'src/shared/service/shared.service';
import { ApiEndpoints } from 'src/shared/utils/api-url';

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.css'],
})
export class ContactInfoComponent implements OnInit {
  // @ViewChild('placesRef') placesRef: GooglePlaceDirective;
  contactInfoForm: FormGroup;
  latitude = '';
  longitude = '';
  mobileVerified = false;
  emailVerified = false;
  dialingCode = '';
  primaryEmail = '';
  primaryMobile = '';
  emergencyContactCode = '';
  alternateContactCode = '';
  emailVerifyMailSuccess: boolean = false;
  emailVerificationMailMsg: string = "";
  showSuccessMsg: boolean = false;
  successMsg: string = "";

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private sharedService: SharedService
  ) {
    this.contactInfoForm = this.formBuilder.group({
      emergency_contact_name: ['', [Validators.required]],
      emergency_dialing_code: ['', [Validators.required]],
      emergency_contact_number: ['', [Validators.required]],
      alternate_dialing_coded: [''],
      alternate_phone: [''],
      alternate_email: [''],
      address_line_1: ['', [Validators.required]],
      address_line_2: [''],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
      county: [''],
      zipcode: ['', [Validators.required]],
      landmark: [''],
    });
  }

  ngOnInit(): void {
    this.setFormValues();
    this.sharedService.getPosition().then((pos) => {
      this.latitude = pos.lat;
      this.longitude = pos.lng;
    });
  }

  get contactInfoFormControl() {
    return this.contactInfoForm.controls;
  }

  setFormValues() {
    this.apiService
      .get(environment.baseURL + ApiEndpoints.GET_PROFILE_DETAIL)
      .subscribe((data: any) => {
        data.data.email_verified === '0'
          ? (this.emailVerified = false)
          : (this.emailVerified = true);
        data.data.mobile_verified === '0'
          ? (this.mobileVerified = false)
          : (this.mobileVerified = true);

        this.dialingCode = data.data.dialing_code;
        this.primaryEmail = data.data.email;
        this.primaryMobile = data.data.mobile;
        data.data.address.emergency_dialing_code
          ? (this.emergencyContactCode =
              data.data.address.emergency_dialing_code)
          : '';
        data.data.address.alternate_dialing_code
          ? (this.alternateContactCode =
              data.data.address.alternate_dialing_code)
          : '';
        this.contactInfoForm.setValue({
          emergency_contact_name: data.data.address.emergency_contact_name,
          emergency_dialing_code: data.data.address.emergency_dialing_code,
          emergency_contact_number: data.data.address.emergency_contact_number,
          alternate_dialing_coded: data.data.address.alternate_dialing_code,
          alternate_phone: data.data.address.alternate_phone,
          alternate_email: data.data.address.alternate_email,
          address_line_1: data.data.address.address_line_1,
          address_line_2: data.data.address.address_line_2,
          city: data.data.address.city,
          state: data.data.address.state,
          country: data.data.address.country,
          county: data.data.address.county ? data.data.address.county : '',
          zipcode: data.data.address.zipcode,
          landmark: data.data.address.landmark,
        });
      });
  }

  saveChanges() {
    if (this.contactInfoForm.valid) {
      let reqBody = {
        emergency_contact_name:
          this.contactInfoForm.value.emergency_contact_name,
        emergency_dialing_code:
          this.contactInfoForm.value.emergency_dialing_code,
        emergency_contact_number:
          this.contactInfoForm.value.emergency_contact_number,
        alternate_dialing_coded:
          this.contactInfoForm.value.alternate_dialing_coded,
        alternate_phone: this.contactInfoForm.value.alternate_phone,
        alternate_email: this.contactInfoForm.value.alternate_email,
        address_line_1: this.contactInfoForm.value.address_line_1,
        address_line_2: this.contactInfoForm.value.address_line_2,
        city: this.contactInfoForm.value.city,
        state: this.contactInfoForm.value.state,
        country: this.contactInfoForm.value.country,
        county: this.contactInfoForm.value.county,
        zipcode: this.contactInfoForm.value.zipcode,
        landmark: this.contactInfoForm.value.landmark,
        latitude: this.latitude,
        longitude: this.longitude,
      };

      this.apiService
        .post(environment.baseURL + ApiEndpoints.SAVE_CONTACT_INFO, reqBody)
        .subscribe(
          (data: any) => {
            this.setFormValues();
            this.successMsg = data.message;
            this.showSuccessMsg = true;
          },
          (error) => {
            if (error.error.address_line_1) {
              this.contactInfoForm.controls['address_line_1'].setErrors({
                incorrect: error.error.address_line_1,
              });
            }
            if (error.error.city) {
              this.contactInfoForm.controls['city'].setErrors({
                incorrect: error.error.city,
              });
            }
            if (error.error.state) {
              this.contactInfoForm.controls['state'].setErrors({
                incorrect: error.error.state,
              });
            }
            if (error.error.country) {
              this.contactInfoForm.controls['country'].setErrors({
                incorrect: error.error.country,
              });
            }
            if (error.error.zipcode) {
              this.contactInfoForm.controls['zipcode'].setErrors({
                incorrect: error.error.zipcode,
              });
            }
            if (error.error.emergency_contact_number) {
              this.contactInfoForm.controls[
                'emergency_contact_number'
              ].setErrors({
                incorrect: error.error.emergency_contact_number,
              });
            }
            if (error.error.emergency_contact_name) {
              this.contactInfoForm.controls['emergency_contact_name'].setErrors(
                {
                  incorrect: error.error.emergency_contact_name,
                }
              );
            }
          }
        );
    }
  }
  changeAddress() {
    console.log('this is called');
    this.contactInfoForm.patchValue({
      address_line_2: '',
      city: '',
      state: '',
      country: '',
      county: '',
      zipcode: '',
      landmark: '',
    });
  }
  public handleAddressChange(address: any) {
    let flag = false;
    address.address_components.forEach((e: any) => {
      if (
        (e.types.indexOf('neighborhood') != -1 &&
          e.types.indexOf('political') != -1) ||
        e.types.indexOf('street_address') != -1 ||
        e.types.indexOf('route') != -1 ||
        e.types.indexOf('premise') != -1 ||
        (e.types.indexOf('sublocality_level_3') != -1 &&
          e.types.indexOf('political') != -1 &&
          e.types.indexOf('sublocality') != -1)
      ) {
        flag = true;
        this.contactInfoForm.patchValue({
          address_line_1: e.long_name,
        });
      }
      if (e.types.indexOf('sublocality_level_1') != -1) {
        this.contactInfoForm.patchValue({
          address_line_2: e.long_name,
        });
      }
      if (
        e.types.indexOf('country') != -1 ||
        e.types.indexOf('political') != -1
      ) {
        this.contactInfoForm.patchValue({
          country: e.long_name,
        });
      }
      if (e.types.indexOf('postal_code') != -1) {
        this.contactInfoForm.patchValue({
          zipcode: e.long_name,
        });
      }
      if (e.types.indexOf('administrative_area_level_1') != -1) {
        this.contactInfoForm.patchValue({
          state: e.long_name,
        });
      }
      if (e.types.indexOf('administrative_area_level_2') != -1) {
        this.contactInfoForm.patchValue({
          city: e.long_name,
        });
      }
    });
    if (flag) {
      this.contactInfoForm.patchValue({
        address_line_1: address.address_components[0].long_name,
      });
    }
  }

  sendEmailVerificationMail() {
    let reqBody = {
      user_id: this.sharedService.getUserDetails().user_id
    };
    this.apiService
    .post(environment.baseURL + ApiEndpoints.VERIFY_EMAIL, reqBody)
    .subscribe((data: any) => {
      console.log('dataaa', data);
      this.emailVerificationMailMsg = data.message;
      this.emailVerifyMailSuccess = true;
    });
    ;
  }


}
