import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/shared/service/api.service';
import { SharedService } from 'src/shared/service/shared.service';
import { ApiEndpoints } from 'src/shared/utils/api-url';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { PropertyService } from '../property-listing.service';

@Component({
  selector: 'app-short-term-pricing',
  templateUrl: './short-term-pricing.component.html',
  styleUrls: ['./short-term-pricing.component.css'],
})
export class ShortTermPricingComponent implements OnInit {
  CLEANING_FREQUENCY_PER_NIGHT = 1;
  CLEANING_FREQUENCY_PER_STAY = 2;
  CHANGE_PRICE_BY_PERCENTAGE = 1;
  CHANGE_PRICE_BY_AMOUNT = 2;

  req:any = {
    user_id: this.sharedService.getUserDetails().user_id,
    pro_id: this.sharedService.propertyId,
    base_price_per_night: '',
    weekend_price_per_night: '',
    weekend: [],
    per_week_price: 0,
    price_for_1additional_guest: '',
    cleaning_frequency: this.CLEANING_FREQUENCY_PER_NIGHT,
    cleaning_amount: '',
    book_now_pay_later: 0,
    pay_later_frequency: this.CHANGE_PRICE_BY_PERCENTAGE,
    pay_later_amount: 0,
  };
  saveNExit: boolean = false;
  isEdit: boolean = false;
  weekends: any[] = [];
  additionalGuestAllowed: boolean = false;
  property:any;
  pro_idd: any;
  

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private apiService: ApiService,
    private location: Location,
    private route: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
    private proListingService: PropertyService,
    private propertyListingService:PropertyService
  ) { }

  async ngOnInit() {
    let pro_id = this.route.snapshot.queryParamMap.get('proId');
    if (pro_id) {
      this.isEdit = true;
      await this.proListingService.getpropertyById(pro_id);
      this.weekends = this.proListingService.property.weekends;
      this.property=this.proListingService.property;
      this.populateFeilds();
    } else {
      this.router.navigateByUrl(this.proListingService.CREATE_PROPERTY_STEP_ONE);
      return;
    }

    
    // =============================SUMIT=======================================

this.pro_idd = this.activatedRoute.snapshot.queryParamMap.get('proId');
console.log(this.pro_idd) 
if(!this.pro_idd){
  const subscription = this.router.events.subscribe((val:any) => {
    // see also 
    // console.log(val) 
    this.pro_idd = this.propertyListingService.getCurrentPropertyId()
    if(this.pro_idd && val.url=='/host/property-listing/short-term/amenities'){
      this.router.navigateByUrl(val.url+"?proId="+this.pro_idd);
    }

    // subscription.unsubscribe()
});
}


//----------------------End ------------------------------------------------
  }

  dayChange(e:any, key: string) {
    console.log(e);
    if(e.target.checked) {
      this.req.weekend.push(key);
    } else if (this.req.weekend.includes(key)) {
      this.req.weekend.splice(this.req.weekend.indexOf(key),1);
    }
  }

  isSelected(key:any){
    this.req.weekend.includes(key);
  }

  saveAndExit() {
    this.saveNExit = true;
    this.saveAndNext();
  }

  get isValid() {
    let isvalid = true;
    if (!this.req.base_price_per_night) {
      isvalid = false;
    }
    if (!this.req.weekend_price_per_night) {
      isvalid = false;
    }
    if (this.property && this.property.step_three.additional_guest_allow && !this.req.price_for_1additional_guest) {
      isvalid = false;
    }
    if (!this.req.cleaning_amount) {
      isvalid = false;
    }
    return isvalid
  }

  saveAndNext() {
    this.req.user_id = this.sharedService.getUserDetails().user_id;
    this.req.pro_id = this.proListingService.getCurrentPropertyId();
    if (!this.additionalGuestAllowed) {
      delete this.req['price_for_1additional_guest']; 
    }
    this.apiService
      .post(environment.baseURL + ApiEndpoints.PROPERTY_STEP5, this.req)
      .subscribe((data: any) => {
        this.proListingService.property = data.data;
        let url = this.saveNExit ? "host/property-list" : '/host/property-listing/short-term/seasonal-pricing?proId=' + this.proListingService.getCurrentPropertyId();
        if (this.saveNExit) {
          this.proListingService.property = null
        }
        this.router.navigateByUrl(url);
      });
  }

  back(): void {
    this.location.back();
  }

  populateFeilds() {
    this.additionalGuestAllowed = this.proListingService.property.step_three.additional_guest_allow == 1;
    this.req = this.proListingService.property.step_five;
    if (!this.req.cleaning_frequency) {
      this.req.cleaning_frequency = this.CLEANING_FREQUENCY_PER_NIGHT
    }
    if ( !this.req.weekend ) {
      this.req.weekend = [];
    }
    if (this.req.per_week_price == null) {
      this.req.per_week_price = 0;
    }
  }
}
