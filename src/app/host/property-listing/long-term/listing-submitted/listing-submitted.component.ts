import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/shared/service/shared.service';
import { LongTermPropertyService } from '../long-term-property-listing.service';
import { ApiService } from 'src/shared/service/api.service';
import { ApiEndpoints } from 'src/shared/utils/api-url';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-listing-submitted',
  templateUrl: './listing-submitted.component.html',
  styleUrls: ['./listing-submitted.component.css']
})
export class ListingSubmittedComponent implements OnInit {
  step = 1
  property: any
  message: any = "Congratulations,\nYour listing has been submitted successfully"
  pro_id: any;

  constructor(
    private sharedService: SharedService,
    private proListingService: LongTermPropertyService,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private location: Location,
  ) { }

  async ngOnInit() {
    this.pro_id = this.route.snapshot.queryParamMap.get('proId');
    if (this.pro_id) {
      await this.proListingService.getpropertyById(this.pro_id);
      if (!this.proListingService.getStepFive()) {
        this.router.navigateByUrl(this.proListingService.CREATE_PROPERTY_STEP_SIX+ "?proId=" + this.pro_id);
        return
      }
    }
    else {
      this.router.navigateByUrl(this.proListingService.CREATE_PROPERTY_STEP_ONE);
      return;
    }

    this.property = this.proListingService.property
    if(this.property.publish_step.str_terms && this.property.step_zero.status==1){
      this.step=2
    }
    else{
      this.step = 1;
    }

  }

  navigateToPublicView() {
    this.router.navigateByUrl('/property/detail/' + this.proListingService.property.step_zero.pro_slug);
    this.proListingService.property = null
  }

  onClose(termAndCondition:boolean) {
    let postData = {
      pro_id: this.proListingService.getCurrentPropertyId(),
      user_id: this.sharedService.getUserDetails().user_id,
      term_and_condition:termAndCondition
    }
    this.apiService.post(environment.baseURL + ApiEndpoints.longTermProperty.PROPERTY_PUBLISH, postData)
      .subscribe(
        (data) => {
          this.proListingService.property = data.data;
          this.property = this.proListingService.property
          if (this.property.publish_step_message) {
            this.message = this.property.publish_step_message
            this.step = 2
          }
        },
        (error) => {
          console.log("error publishing property", error);
        }
      );
  }

  clearProperty() {
    this.proListingService.property = null
  }
}
