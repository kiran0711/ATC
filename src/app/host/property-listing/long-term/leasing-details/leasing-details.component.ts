import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { leaseDurations } from 'src/app/app.constants';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/shared/service/api.service';
import { SharedService } from 'src/shared/service/shared.service';
import { ApiEndpoints } from 'src/shared/utils/api-url';
import { LongTermPropertyService } from '../long-term-property-listing.service';

@Component({
  selector: 'app-leasing-details',
  templateUrl: './leasing-details.component.html',
  styleUrls: ['./leasing-details.component.css']
})
export class LeasingDetailsComponent implements OnInit {
  pro_id: any;
  propertyLeaseForm: FormGroup;
  saveNExit: boolean = false;
  errorMsg: null;
  loginUser: any;
  leaseDurations: any = leaseDurations;
  coOnwers: any = [
    { name: '', email: '' }
  ]
  minimumDate: Date;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    public proListingService: LongTermPropertyService,
  ) {
    this.propertyLeaseForm = this.formBuilder.group({
      monthly_rent: ['', [Validators.required]],
      security_deposit: [true],
      security_deposite_amount: ['', [Validators.required]],
      minimum_lease_duration: ['', [Validators.required]],
      maximum_lease_duration: ['', [Validators.required]],
      lease_start_date: ['', [Validators.required]],
      allow_sub_leasing: [false],
      listing_on_behalfof_landlord: [false],
      listing_on_behalfof_landlord_name: [''],
      more_landlords: [false],
      co_owner_authorization: [false],
      lease_document_notarised_by_lawyer: [false],
      notary_fee_paid_by: ['1'],
      // rental_agreement_behalf_of: [false],
      // rental_agreement_behalf_of_name: ['', [Validators.required, Validators.maxLength(70)]],
      tenant_insurance_required: [true]
    });

    //value changes
    this.propertyLeaseForm.controls.security_deposit.valueChanges.subscribe((val: boolean) => {
      if (val) {
        this.propertyLeaseForm.controls.security_deposite_amount.setValidators([Validators.required]);
      }
      else {
        this.propertyLeaseForm.controls.security_deposite_amount.clearValidators();
      }
      this.propertyLeaseForm.controls.security_deposite_amount.updateValueAndValidity();
    })

    this.propertyLeaseForm.controls.minimum_lease_duration.valueChanges.subscribe((val: string) => {
      if (val) {
        if (parseInt(val) > parseInt(this.propertyLeaseFormControl.maximum_lease_duration.value)) {
          this.propertyLeaseForm.patchValue({ minimum_lease_duration: '' })
        }
      } 
    })

    this.propertyLeaseForm.controls.maximum_lease_duration.valueChanges.subscribe((val: string) => {
      if (val) {
        if (parseInt(val) < parseInt(this.propertyLeaseFormControl.minimum_lease_duration.value)) {
          this.propertyLeaseForm.patchValue({ maximum_lease_duration: '' })
        }
      }
    })



    this.propertyLeaseForm.controls.listing_on_behalfof_landlord.valueChanges.subscribe((val: boolean) => {
      if (val) {
        this.propertyLeaseForm.controls.listing_on_behalfof_landlord_name.setValidators([Validators.required]);
      }
      else {
        this.propertyLeaseForm.controls.listing_on_behalfof_landlord_name.clearValidators();
      }
      this.propertyLeaseForm.controls.listing_on_behalfof_landlord_name.updateValueAndValidity();
    })
    // this.propertyLeaseForm.controls.rental_agreement_behalf_of.valueChanges.subscribe((val: boolean) => {
    //   if (val) {
    //     this.propertyLeaseForm.controls.rental_agreement_behalf_of_name.clearValidators();
    //   }
    //   else {
    //     this.propertyLeaseForm.controls.rental_agreement_behalf_of_name.setValidators([Validators.required, Validators.maxLength(70)]);
    //   }
    //   this.propertyLeaseForm.controls.rental_agreement_behalf_of_name.updateValueAndValidity();
    // })

  }

  async ngOnInit(): Promise<void> {
    this.loginUser = this.sharedService.getUserDetails();
    this.minimumDate = new Date();
    this.minimumDate.setDate(this.minimumDate.getDate());

    this.pro_id = this.route.snapshot.queryParamMap.get('proId');
    if (this.pro_id) {
      await this.proListingService.getpropertyById(this.pro_id);
      if (!this.proListingService.getStepFour()) {
        this.router.navigateByUrl(this.proListingService.CREATE_PROPERTY_STEP_FIVE + "?proId=" + this.pro_id);
        return
      }
      this.populateFeilds();
    }
    else {
      this.router.navigateByUrl(this.proListingService.CREATE_PROPERTY_STEP_ONE);
      return;
    }

  }
  populateFeilds() {
    let data = this.proListingService.property.step_five;
    this.propertyLeaseForm.setValue({
      monthly_rent: data.monthly_rent,
      security_deposit: data.security_deposit,
      security_deposite_amount: data.security_deposite_amount,
      minimum_lease_duration: data.minimum_lease_duration,
      maximum_lease_duration: data.maximum_lease_duration,
      lease_start_date: new Date(data.lease_start_date),
      allow_sub_leasing: data.allow_sub_leasing,
      listing_on_behalfof_landlord: data.listing_on_behalfof_landlord,
      listing_on_behalfof_landlord_name: data.listing_on_behalfof_landlord_name,
      more_landlords: data.more_landlords,
      co_owner_authorization: data.co_owner_authorization,
      lease_document_notarised_by_lawyer: data.lease_document_notarised_by_lawyer,
      notary_fee_paid_by: data.notary_fee_paid_by,
      // rental_agreement_behalf_of: data.rental_agreement_behalf_of,
      // rental_agreement_behalf_of_name: data.rental_agreement_behalf_of_name,
      tenant_insurance_required: data.tenant_insurance_required
    });
    this.coOnwers = data.co_owners;
  }

  addLandload() {
    if (this.coOnwers.length < 3)
      this.coOnwers.push({ name: '', email: '' });
  }
  deleteLandload(i: any) {
    if (this.coOnwers.length > 1)
      this.coOnwers = this.coOnwers.filter((item: any, index: any) => index != i);

  }
  saveAndExit() {
    this.saveNExit = true;
    this.next();
  }
  next() {
    let data = this.propertyLeaseForm.value;
    data.pro_id = this.proListingService.property?.step_zero?.pro_id;
    data.user_id = this.loginUser.user_id;

    // if (data.rental_agreement_behalf_of) {
    //   data.rental_agreement_behalf_of_name = `${this.loginUser.firstname} ${this.loginUser.lastname}`;
    // }

    if (!data.lease_document_notarised_by_lawyer) {
      data.notary_fee_paid_by = 0;
    }

    data.security_deposit = data.security_deposit ? 1 : 0;
    data.allow_sub_leasing = data.allow_sub_leasing ? 1 : 0;
    data.listing_on_behalfof_landlord = data.listing_on_behalfof_landlord ? 1 : 0;
    data.more_landlords = data.more_landlords ? 1 : 0;
    data.co_owner_authorization = data.co_owner_authorization ? 1 : 0;
    data.lease_document_notarised_by_lawyer = data.lease_document_notarised_by_lawyer ? 1 : 0;
    // data.rental_agreement_behalf_of = data.rental_agreement_behalf_of ? 1 : 0;
    data.tenant_insurance_required = data.tenant_insurance_required ? 1 : 0;

    data.co_owners = this.coOnwers;
    data.lease_start_date = this.datePipe.transform(data.lease_start_date, 'yyyy-MM-dd')

    console.log(data);
    this.apiService.post(environment.baseURL + ApiEndpoints.longTermProperty.PROPERTY_STEP_LEASING_DETAILS, data).subscribe((data: any) => {
      this.errorMsg = null
      this.proListingService.property = data.data;
      let proId = data.data.step_zero.pro_id;
      let url = this.saveNExit ? "host/property-list" : '/host/property-listing/long-term/listing-submitted?proId=' + proId;
      if (this.saveNExit) {
        this.proListingService.property = null
      }
      this.router.navigateByUrl(url);
    }, (error: any) => {
      this.errorMsg = error.message
    });

  }
  get propertyLeaseFormControl() {
    return this.propertyLeaseForm.controls;
  }
}
