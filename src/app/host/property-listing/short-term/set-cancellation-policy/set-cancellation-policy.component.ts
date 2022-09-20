import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/shared/service/api.service';
import { SharedService } from 'src/shared/service/shared.service';
import { ApiEndpoints } from 'src/shared/utils/api-url';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { PropertyService } from '../property-listing.service';

const POLICY = { season_id:null, policy_description:"", no_of_hours:0, refund_per:0, admin_policy_id:0};
@Component({
  selector: 'app-set-cancellation-policy',
  templateUrl: './set-cancellation-policy.component.html',
  styleUrls: ['./set-cancellation-policy.component.css']
})
export class SetCancellationPolicyComponent implements OnInit {
  

  policyMaster: any[] = [];
  selectedPolicies: any = {};
  policyCharCount: any = {0:0, 1:0, 2:0};

  req = {
    own_policy_arr: "",
    pro_id: this.sharedService.propertyId,
    user_id: this.sharedService.getUserDetails().user_id
  };
  saveNExit: boolean = false;
  seasonList: any[] = [];
  customPolicy: any[] = [JSON.parse(JSON.stringify(POLICY))];
  isEdit: boolean = false;
  pro_idd:any;

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    public proListingService: PropertyService,
    private propertyListingService:PropertyService,
  ) { }

  async ngOnInit() {
    let pro_id = this.route.snapshot.queryParamMap.get('proId');
    if (pro_id) {
      this.isEdit = true;
      await this.proListingService.getpropertyById(pro_id);
    } else {
      this.router.navigateByUrl(this.proListingService.CREATE_PROPERTY_STEP_ONE);
      return;
    }
    this.policyMaster = this.proListingService.property.all_calcellation_policy.map((p:any) => { return{ ...p, readmore:false,  };});
    this.seasonList = this.proListingService.property.all_season_list;
    this.populateFeilds();



    // =============================SUMIT=======================================

    this.pro_idd = this.activatedRoute.snapshot.queryParamMap.get('proId');
    console.log(this.pro_idd) 
    if(!this.pro_idd){
      const subscription = this.router.events.subscribe((val:any) => {
        // see also 
        // console.log(val) 
        this.pro_idd = this.propertyListingService.getCurrentPropertyId()
        if(this.pro_idd && val.url=='/host/property-listing/short-term/calendar'){
          this.router.navigateByUrl(val.url+"?proId="+this.pro_idd);
        }
    
        // subscription.unsubscribe()
    });
    }
    
    
    //----------------------End ------------------------------------------------

  }

  addMoreCustomPolicy() {
    // if (this.req.own_policy_arr.length < 3) {
    if (this.customPolicy.length < this.seasonList.length) {
      this.customPolicy.push(JSON.parse(JSON.stringify(POLICY)));
    }
  }

  removeCustomPolicy(index:any) {
    if (this.customPolicy.length > 0) {
      this.customPolicy.splice(index, 1);
    }
  }

  onSeasonSelect(event:any, seasonId: any, policy:any) {
    console.log(event.target.checked)
    if (event.target.checked) {
      this.selectedPolicies[seasonId] = policy;
    } else {
      delete this.selectedPolicies[seasonId];
    }
  }

  get isValid(){
    let isvalid=true
    this.seasonList.forEach(element => {
      if(element.display && !this.selectedPolicies[element.season_id]){
        isvalid=false
      }
    });
    let val : any;
    for (val of Object.values(this.policyCharCount)){
      if (val > 1000){
        isvalid = false;
        break;
      }
    }
    return isvalid
  }

  saveAndExit(){
    this.saveNExit = true;
    this.saveAndNext();
  }

  saveAndNext(){ 
    let arr = Object.keys(this.selectedPolicies).map(si => { 
      let p = this.selectedPolicies[si];
      return {
        season_id: si, 
        own_no_of_hours: p.no_of_hours, 
        own_refund_per: p.refund_per, 
        create_own_policy: p.policy_description,
        admin_policy_id: p.policy_id || 0
      };
    });
    this.req.own_policy_arr = JSON.stringify(arr);
    this.req.pro_id= this.proListingService.getCurrentPropertyId();
    this.apiService
      .post(environment.baseURL + ApiEndpoints.SAVE_CANCELLATION_POLICY, this.req)
      .subscribe((data: any) => {
        this.proListingService.property = data.data;
        let url = this.saveNExit ? "host/property-list" : '/host/property-listing/short-term/upload-photos-videos?proId=' + this.proListingService.getCurrentPropertyId();
        if(this.saveNExit){
          this.proListingService.property = null
        }
        this.router.navigateByUrl(url);
      });
  }

  skipToNext() {
    this.router.navigateByUrl('/host/property-listing/short-term/upload-photos-videos');
  }

  populateFeilds() {
    this.policyMaster = this.proListingService.property.all_calcellation_policy.map((p:any) => { return{ ...p, readmore:false,  };});
    this.customPolicy = [];
    let data = this.proListingService.property.step_seven;    
    data.forEach((policy:any) => {
      if (policy.admin_policy_id != 0) {
        this.selectedPolicies[policy.season_id] = this.policyMaster.find(p => p.policy_id == policy.admin_policy_id);
      } else {
        let existingPolicy = { 
          season_id: policy.season_id,
          policy_description:policy.create_own_policy, 
          no_of_hours:policy.own_no_of_hours, 
          refund_per:policy.own_refund_per,
          admin_policy_id: policy.admin_policy_id
        };
        this.selectedPolicies[policy.season_id] = existingPolicy;
        this.customPolicy.push(existingPolicy);
        this.policyCharCount[this.customPolicy.length-1] = existingPolicy.policy_description?.length;
        
      }
    });
    if (this.customPolicy.length == 0) {
      this.customPolicy.push(JSON.parse(JSON.stringify(POLICY)));
    }
  }

  isSelected(seasonId:any, policy:any ){
    return this.selectedPolicies[seasonId] && this.isSame(this.selectedPolicies[seasonId], policy);
  }

  isSame(selected:any, current:any) {
    let keys = Object.keys(selected);
    for(let key of keys) {
      if (selected[key] != current[key]) {
        return false;
      }
    }
    return true;
  }

  back(): void {
    this.location.back();
  }
}
