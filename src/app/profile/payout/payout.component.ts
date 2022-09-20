import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GUEST, ROLE } from 'src/app/app.constants';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/shared/service/api.service';
import { SharedService } from 'src/shared/service/shared.service';
import { ApiEndpoints } from 'src/shared/utils/api-url';

@Component({
  selector: 'app-payout',
  templateUrl: './payout.component.html',
  styleUrls: ['./payout.component.css']
})
export class PayoutComponent implements OnInit, OnDestroy {
  payoutForm: FormGroup;
  currentRoleText: string | null;
  private subscriptions$ = new Subscription();
  alertMsg: boolean;
  pwdErrorMsg: any;
  pwdSuccessMsg: any;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {

    //user role is guest then redirect 
    this.currentRoleText = localStorage.getItem(ROLE)
    if (this.currentRoleText === GUEST) {
      this.router.navigateByUrl('/profile/general-info');
    }
  }

  ngOnInit(): void {
    this.createPayoutForm()
    this.setPayoutForm();
  }

  // form methods create and update
  createPayoutForm() {
    this.payoutForm = this.formBuilder.group({
      user_type: ['host', [Validators.required]],
      mode: ['', [Validators.required]],
      bank_type: [''],
      account_name: ['', [Validators.maxLength(150)]],
      account_number: ['', [Validators.maxLength(50)]],
      bank_name: ['', [Validators.maxLength(100)]],
      bank_address: ['', [Validators.maxLength(200)]],

      institution_number: ['', [Validators.maxLength(100)]],
      transit_number: ['', [Validators.maxLength(100)]],

      routing_number: ['', [Validators.maxLength(20)]],
      iban: ['', [Validators.maxLength(20)]],
      swift: ['', [Validators.maxLength(20)]],

      paypal_email: ['', [Validators.maxLength(150), Validators.email]]

    });
  }
  setPayoutForm() {
    this.apiService.get(environment.baseURL + ApiEndpoints.GET_PROFILE_DETAIL).subscribe(
      (data: any) => {
        this.payoutForm.patchValue({
          mode: data.data.hostpayout.mode,
          bank_type: data.data.hostpayout.bank_type,
          account_name: data.data.hostpayout.account_name,
          account_number: data.data.hostpayout.account_number,
          bank_name: data.data.hostpayout.bank_name,
          bank_address: data.data.hostpayout.bank_address,
          institution_number: data.data.hostpayout.institution_number,
          transit_number: data.data.hostpayout.transit_number,
          routing_number: data.data.hostpayout.routing_number,
          iban: data.data.hostpayout.iban,
          swift: data.data.hostpayout.swift,
          paypal_email: data.data.hostpayout.paypal_email
        });
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  // validation methods
  isFieldInvalid(field: any) {
    return this.payoutForm.controls[field].invalid && this.payoutForm.controls[field].errors && (this.payoutForm.controls[field].dirty || this.payoutForm.controls[field].touched);
  }
  isFieldRequired(field: any) {
    if (this.payoutForm.controls[field].invalid && this.payoutForm.controls[field].errors && (this.payoutForm.controls[field].dirty || this.payoutForm.controls[field].touched)) {
      return this.payoutForm.controls[field].hasError('required')
    }
    else {
      return false
    }

  }
  isFieldMaxLength(field: any) {
    if (this.payoutForm.controls[field].invalid && this.payoutForm.controls[field].errors && (this.payoutForm.controls[field].dirty || this.payoutForm.controls[field].touched)) {
      return this.payoutForm.controls[field].hasError('maxlength')
    }
    else {
      return false
    }

  }
  isFieldEmailValid(field: any) {
    if (this.payoutForm.controls[field].invalid && this.payoutForm.controls[field].errors && (this.payoutForm.controls[field].dirty || this.payoutForm.controls[field].touched)) {
      return this.payoutForm.controls[field].hasError('email')
    }
    else {
      return false
    }

  }

  // onchange methods
  onChangePayout() {
    let value = this.payoutForm.controls['mode'].value;
    switch (value) {
      case 'bank':
        this.payoutForm.controls['paypal_email'].removeValidators([Validators.required]);

        this.payoutForm.controls['bank_type'].addValidators([Validators.required]);
        this.payoutForm.controls['account_name'].addValidators([Validators.required]);
        this.payoutForm.controls['account_number'].addValidators([Validators.required]);
        this.payoutForm.controls['bank_name'].addValidators([Validators.required]);
        this.payoutForm.controls['bank_address'].addValidators([Validators.required]);
        break;
      case 'paypal':
        this.payoutForm.controls['paypal_email'].addValidators([Validators.required]);

        this.payoutForm.controls['bank_type'].removeValidators([Validators.required]);
        this.payoutForm.controls['account_name'].removeValidators([Validators.required]);
        this.payoutForm.controls['account_number'].removeValidators([Validators.required]);
        this.payoutForm.controls['bank_name'].removeValidators([Validators.required]);
        this.payoutForm.controls['bank_address'].removeValidators([Validators.required]);

        this.payoutForm.controls['routing_number'].removeValidators([Validators.required]);
        this.payoutForm.controls['iban'].removeValidators([Validators.required]);
        this.payoutForm.controls['swift'].removeValidators([Validators.required]);

        this.payoutForm.controls['institution_number'].removeValidators([Validators.required]);
        this.payoutForm.controls['transit_number'].removeValidators([Validators.required]);


        break;
      default:
        break;
    }
    this.payoutForm.controls['paypal_email'].updateValueAndValidity();
    this.payoutForm.controls['bank_type'].updateValueAndValidity();
    this.payoutForm.controls['account_name'].updateValueAndValidity();
    this.payoutForm.controls['account_number'].updateValueAndValidity();
    this.payoutForm.controls['bank_name'].updateValueAndValidity();
    this.payoutForm.controls['bank_address'].updateValueAndValidity();

    this.payoutForm.controls['institution_number'].updateValueAndValidity();
    this.payoutForm.controls['transit_number'].updateValueAndValidity();
    this.payoutForm.controls['routing_number'].updateValueAndValidity();
    this.payoutForm.controls['iban'].updateValueAndValidity();
    this.payoutForm.controls['swift'].updateValueAndValidity();
  }
  onChangePayoutBank() {
    let value = this.payoutForm.controls['bank_type'].value;
    switch (value) {
      case 'canadian':
        this.payoutForm.controls['institution_number'].addValidators([Validators.required]);
        this.payoutForm.controls['transit_number'].addValidators([Validators.required]);
        this.payoutForm.controls['routing_number'].removeValidators([Validators.required]);
        this.payoutForm.controls['iban'].removeValidators([Validators.required]);
        this.payoutForm.controls['swift'].removeValidators([Validators.required]);
        break;
      case 'non-canadian':
        this.payoutForm.controls['routing_number'].addValidators([Validators.required]);
        this.payoutForm.controls['iban'].addValidators([Validators.required]);
        this.payoutForm.controls['swift'].addValidators([Validators.required]);
        this.payoutForm.controls['institution_number'].removeValidators([Validators.required]);
        this.payoutForm.controls['transit_number'].removeValidators([Validators.required]);
        break;
      default:
        break;
    }
    this.payoutForm.controls['institution_number'].updateValueAndValidity();
    this.payoutForm.controls['transit_number'].updateValueAndValidity();
    this.payoutForm.controls['routing_number'].updateValueAndValidity();
    this.payoutForm.controls['iban'].updateValueAndValidity();
    this.payoutForm.controls['swift'].updateValueAndValidity();

  }

  // submit form
  handlePayoutForm(e: any) {
    e.preventDefault();
    if (!this.payoutForm.valid) {
      return;
    }
    this.apiService
      .post(environment.baseURL + ApiEndpoints.PAYOUT, this.payoutForm.value)
      .subscribe(
        (data: any) => {
          this.pwdSuccessMsg = data.message;
          this.pwdErrorMsg = null;
          this.alertMsg = true;
          this.setPayoutForm();
        },
        (error: any) => {
          console.log(error);
          this.pwdErrorMsg = error.message;
          this.pwdSuccessMsg = null;
          this.alertMsg = true;
        }
      );



  }

  //end of component
  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
  }
}
