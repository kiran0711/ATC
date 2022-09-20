import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { localStorageKeys } from 'src/app/app.constants';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/shared/service/api.service';
import { ApiEndpoints } from 'src/shared/utils/api-url';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})

export class FooterComponent implements OnInit {

  subscriptionForm: FormGroup;
  didnotFindForm: FormGroup;
  subsSuccess: boolean = false;
  subsFailed: boolean = false;
  successMsg: any = "";
  failedMsg: any = "";
  selectedProperties: any[] = [];
  lookingForSuccess = false;
  lookingForFailed = false;
  lookingforlocations: any;

  
  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private toastr: ToastrService,
  ) {
    this.subscriptionForm = this.formBuilder.group({
      subscribe_email: ['', [Validators.required]],
    });
    this.didnotFindForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(150)]],
      dialing_code: ['', [Validators.required]],
      mobile: ['', [Validators.required, Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.maxLength(150)]],
      location: [''],
      radius: [''],
      property_type: [''],
      comment: ['', [Validators.maxLength(500)]],
    });
   
  }
 
  get lookingForFormControl() {
    return this.didnotFindForm.controls;
  }

  async ngOnInit() {
    let reqBody = {
      per_page: 50,
      category_name: 'location'
    };
    let resp: any = await this.apiService.postSync(environment.baseURL + ApiEndpoints.GET_TOP_DESTINATION_BY_CATEGORY, reqBody);
    this.lookingforlocations = resp.data.data;
  }

  onChangePropertyTypes(e: any) {
    if (e.target.checked) {
      this.selectedProperties.push(e.target.value);
    } else {
      if (this.selectedProperties.includes(e.target.value)) {
        this.selectedProperties.splice(this.selectedProperties.indexOf(e.target.value), 1);
      }
    }
  }
  currentYearLong(): number {
    return new Date().getFullYear();
  }
  sendInterest() {
    let req = {
      ...this.didnotFindForm.value,
      property_type: this.selectedProperties
    }
    this.apiService
      .post(environment.baseURL + ApiEndpoints.WHAT_LOOKING_FOR, req)
      .subscribe((data: any) => {
        this.lookingForSuccess = true;
        this.successMsg = data.message;
        setTimeout(() => { this.lookingForSuccess = false }, 5000);
      },
        (error) => {
          console.log(error);
          if (error.error.name) {
            this.didnotFindForm.controls['name'].setErrors({
              incorrect: error.error.name,
            });
          } else if (error.error.email) {
            this.didnotFindForm.controls['email'].setErrors({
              incorrect: error.error.email,
            });
          } else if (error.error.dialing_code) {
            this.didnotFindForm.controls['dialing_code'].setErrors({
              incorrect: error.error.dialing_code,
            });
          } else if (error.error.mobile) {
            this.didnotFindForm.controls['mobile'].setErrors({
              incorrect: error.error.mobile,
            });
          } else if (error.error.comment) {
            this.didnotFindForm.controls['comment'].setErrors({
              incorrect: error.error.comment,
            });
          } else {
            this.lookingForFailed = true;
            this.failedMsg = error.message;
            setTimeout(() => { this.lookingForFailed = false }, 5000);
          }
        });
  }

  subscribeNewsLetters() {
    console.log(this.subscriptionForm.value.subscribe_email);
    const reqBody = {
      subscribe_email: this.subscriptionForm.value.subscribe_email,
    };
    this.apiService
      .post(environment.baseURL + ApiEndpoints.SUBSCRIPTION, reqBody)
      .subscribe((data: any) => {
        console.log('data', data);
        //this.toastr.success(data.message);
        this.subsSuccess = true;
        this.successMsg = data.message;
        setTimeout(() => { this.subsSuccess = false }, 5000);
      },
        (error: any) => {
          this.subsFailed = true;
          this.failedMsg = error.message;
          setTimeout(() => { this.subsFailed = false }, 5000);
        });
  }



}
