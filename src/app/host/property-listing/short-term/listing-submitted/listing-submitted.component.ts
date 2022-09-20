import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/shared/service/shared.service';
import { PropertyService } from '../property-listing.service';
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
  step=1
  property:any
  message:any="Congratulations,\nYour listing has been submitted successfully"
  constructor(
    private sharedService: SharedService,
    private proListingService: PropertyService,
    private router: Router,
    private route:ActivatedRoute,
    private apiService: ApiService,
    private location: Location,
  ) { }

  async ngOnInit() {
    let pro_id = this.route.snapshot.queryParamMap.get('proId');
    if (pro_id) {
     await this.proListingService.getpropertyById(pro_id);
    }
    if (!this.proListingService.property) {
      this.router.navigateByUrl('/host/property-listing/short-term/title');
      return;
    }
    this.property=this.proListingService.property
    if(this.property.publish_step.str_terms && this.property.step_zero.status==1){
      this.step=2
    }

  }

  navigateToPublicView() {
    this.router.navigateByUrl('/property/detail/' + this.proListingService.property.step_zero.pro_slug);
    this.proListingService.property = null
  }

  onClose(data:any){
    console.log(data);
    let postData={
      pro_id:this.proListingService.getCurrentPropertyId(),
      user_id:this.sharedService.getUserDetails().user_id,
      str_number:data.str,
      str_terms:data.agree
    }
    this.apiService.post(environment.baseURL + ApiEndpoints.PROPERTY_STEP7, postData)
    .subscribe(
      (data) => {
        this.proListingService.property = data.data;
        this.property=this.proListingService.property
        this.message=this.property.publish_step_message
        if(this.property.publish_step.str_terms){
          this.step=2
        }
      },
      (error) => {
        console.log("error publishing property", error);
      }
    );
  }

  clearProperty(){
    this.proListingService.property = null
  }
}
