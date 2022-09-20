import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/shared/service/api.service';
import { ApiEndpoints } from 'src/shared/utils/api-url';
import { timezone } from 'src/shared/utils/timezone';
import * as moment from 'moment';
import { SharedService } from 'src/shared/service/shared.service';
import * as appConstants from 'src/app/app.constants';

@Component({
  selector: 'app-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.css'],
})
export class GeneralInfoComponent implements OnInit {
  timezoneValues = timezone;
  generalInfoForm: FormGroup;
  vaccineCert: any;
  fileName: any;
  docUrl: string = '';
  disableVaccination = false;
  yearsago = new Date(
    moment(new Date()).subtract(18, 'years').format(appConstants.DOB_FORMAT)
  );
  vaccination = '';
  defaultReference = '';
  defaultTimeZone = '';
  defaultGender = '';
  successMsg = '';
  showSuccessMsg = false;
  profilePic = '';
  clickableFile = false;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    public sharedService: SharedService
  ) {
    this.generalInfoForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: [''],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      timezone: [''],
      vaccinated: [''],
      reference: [''],
      user_bio:['']
    });
  }

  ngOnInit(): void {
    console.log('timezoneValues', this.timezoneValues);
    this.setFormValues();
    this.sharedService.userProfilePicture.subscribe((val) => {
      this.profilePic = val;
    });
  }

  get generalInfoFormControl() {
    return this.generalInfoForm.controls;
  }

  setFormValues() {
    this.apiService
      .get(environment.baseURL + ApiEndpoints.GET_PROFILE_DETAIL)
      .subscribe((data: any) => {
        console.log('profiel data', data, data.data.timezone);
        if (
          data.data.vaccination_certificate &&
          data.data.vaccinated === 'Yes'
        ) {
          let first = data.data.vaccination_certificate
            .split('/')[2]
            .split('_')[0];
          let second = data.data.vaccination_certificate
            .split('/')[2]
            .split('.')[1];
          this.fileName = first + '.' + second;
          this.clickableFile = true;
          this.docUrl = data.data.vaccination_certificate_path;
        } else {
          this.fileName = '';
        }
        this.vaccination = data.data.vaccinated;
        this.defaultTimeZone = data.data.timezone;
        this.defaultGender = data.data.gender;
        this.defaultReference = data.data.podsliving_refference;
        this.sharedService.userProfilePictureValue =
          data.data.profile_picture_path;

        this.generalInfoForm.patchValue({
          firstName: data.data.firstname,
          lastName: data.data.lastname,
          dob: new Date(data.data.dob),
          gender: this.defaultGender,
          timezone: this.defaultTimeZone,
          reference: this.defaultReference,
          user_bio:data.data.user_bio?data.data.user_bio:""
        });
        this.sharedService.userDisplayNameValue =
          data.data.firstname + ' ' + (data.data.lastname || '');
      });
  }
  uploadPhoto(e: any) {
    let formData = new FormData();
    formData.append('profile_picture', e.target.files[0]);
    let url = environment.baseURL + ApiEndpoints.PROFILE_PIC_UPDATE;
    this.apiService.post(url, formData).subscribe((data: any) => {
      this.sharedService.userProfilePictureValue =
        data.data.profile_picture_path;
      console.log('profile update response dataaa', data);
    });
  }

  setVaccineCert(e: any) {
    this.vaccineCert = e.target.files[0];
    this.fileName = this.vaccineCert.name;
    this.generalInfoForm.controls['vaccinated'].setErrors(null);
    this.clickableFile = false;
    this.generalInfoForm.controls['vaccinated'].markAsTouched();
    this.generalInfoForm.updateValueAndValidity();
  }

  removeFile() {
    this.fileName = '';
    this.vaccineCert = null;
  }
  selectedType = 'No';

  
  changeVaccinationOption(e: any) {
    this.selectedType = e.target.value;
    console.log(e.target.value);
    e.target.value === 'No'
      ? (this.disableVaccination = true)
      : (this.disableVaccination = false);
  }

  saveChanges() {
    console.log(this.generalInfoForm.value);
    let formData = new FormData();
    formData.append('firstname', this.generalInfoForm.value.firstName);
    formData.append('lastname', this.generalInfoForm.value.lastName);
    formData.append(
      'dob',
      moment(new Date(this.generalInfoForm.value.dob)).format(
        appConstants.DOB_API_FORMAT
      )
    );
    formData.append('gender', this.generalInfoForm.value.gender);
    formData.append('timezone', this.generalInfoForm.value.timezone);
    formData.append('vaccinated', this.generalInfoForm.value.vaccinated);
    formData.append(
      'podsliving_refference',
      this.generalInfoForm.value.reference
    );
    formData.append('vaccination_certificate', this.vaccineCert);
    formData.append('user_bio',this.generalInfoForm.value.user_bio)
    this.apiService
      .post(environment.baseURL + ApiEndpoints.SAVE_PROFILE_INFO, formData)
      .subscribe(
        (data: any) => {
          console.log('dataaa', data);
          this.showSuccessMsg = true;
          this.successMsg = data.message;
          this.setFormValues();
        },
        (error) => {
          console.log(error.error);
          if (error.error.firstname) {
            this.generalInfoForm.controls['firstName'].setErrors({
              incorrect: error.error.firstname,
            });
          }
          if (error.error.lastname) {
            this.generalInfoForm.controls['lastName'].setErrors({
              incorrect: error.error.lastname,
            });
          }
          if (error.error.dob) {
            this.generalInfoForm.controls['dob'].setErrors({
              incorrect: error.error.dob,
            });
          }
          if (error.error.gender) {
            this.generalInfoForm.controls['gender'].setErrors({
              incorrect: error.error.gender,
            });
          }
          if (error.error.vaccination_certificate) {
            this.generalInfoForm.controls['vaccinated'].setErrors({
              incorrect: error.error.vaccination_certificate,
            });
          }

          if (error.error.user_bio) {
            this.generalInfoForm.controls['user_bio'].setErrors({
              incorrect: error.error.user_bio,
            });
          }
        }
      );
  }

  closeMsgToast() {
    this.showSuccessMsg = !this.showSuccessMsg;
  }

  getExternalImageFromURL() {
    window.open(this.docUrl);
  }
}
