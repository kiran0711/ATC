import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/shared/service/api.service';
import { SharedService } from 'src/shared/service/shared.service';
import { ApiEndpoints } from 'src/shared/utils/api-url';
import { Location } from '@angular/common';
import { PropertyService } from '../property-listing.service';

@Component({
  selector: 'app-amenities',
  templateUrl: './amenities.component.html',
  styleUrls: ['./amenities.component.css'],
})
export class AmenitiesComponent implements OnInit {
  amenitiesList: any;
  facilitiesList: any;
  imageUrl = environment.imageURL;
  amenityAndFacilityForm: FormGroup;
  saveNExit: boolean = false;
  isEdit: boolean = false;
  pro_idd: any;

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private apiService: ApiService,
    private fb: FormBuilder,
    private location: Location,
    private route: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
    private proListingService: PropertyService,
    private propertyListingService:PropertyService
  ) {
    this.amenityAndFacilityForm = this.fb.group({
      amenityAndFacility: this.fb.array([]),
    });
  }

  async ngOnInit() {
    let pro_id = this.route.snapshot.queryParamMap.get('proId');
    if (pro_id) {
      this.isEdit = true;
      await this.proListingService.getpropertyById(pro_id);
      this.populateFeilds();
    } else {
      this.router.navigateByUrl(this.proListingService.CREATE_PROPERTY_STEP_ONE);
      return;
    }

    let reqBody = {};
    let resp:any = await this.apiService.postSync(environment.baseURL + ApiEndpoints.AMENITIES, reqBody);
    this.amenitiesList = resp.data.amenities_list;
    this.facilitiesList = resp.data.facilities_list;


    
    // =============================SUMIT=======================================

this.pro_idd = this.activatedRoute.snapshot.queryParamMap.get('proId');
console.log(this.pro_idd) 
if(!this.pro_idd){
  const subscription = this.router.events.subscribe((val:any) => {
    // see also 
    // console.log(val) 
    this.pro_idd = this.propertyListingService.getCurrentPropertyId()
    if(this.pro_idd && val.url=='/host/property-listing/short-term/more-details'){
      this.router.navigateByUrl(val.url+"?proId="+this.pro_idd);
    }

    // subscription.unsubscribe()
});
}


//----------------------End ------------------------------------------------
  }

  isSelected(serviceId: any) {
    const amenityAndFacility: FormArray = this.amenityAndFacilityForm.get(
      'amenityAndFacility'
    ) as FormArray;
    return amenityAndFacility.controls.find(fc => fc.value == serviceId ) != null;
  }

  onCheckboxChange(e: any) {
    const amenityAndFacility: FormArray = this.amenityAndFacilityForm.get(
      'amenityAndFacility'
    ) as FormArray;

    if (e.target.checked) {
      amenityAndFacility.push(new FormControl(e.target.value));
    } else {
      const index = amenityAndFacility.controls.findIndex(
        (x) => x.value === e.target.value
      );

      amenityAndFacility.removeAt(index);
    }
  }

  saveAndExit(){
    this.saveNExit = true;
    this.nextStep();
  }

  nextStep() {
    console.log(this.amenityAndFacilityForm.value.amenityAndFacility);
    let reqBody = {
      user_id: this.sharedService.getUserDetails().user_id,
      pro_id: this.proListingService.getCurrentPropertyId(),
      service_id: this.amenityAndFacilityForm.value.amenityAndFacility,
    };
    this.apiService
      .post(environment.baseURL + ApiEndpoints.PROPERTY_STEP4, reqBody)
      .subscribe((data: any) => {
        console.log('data', data);
        this.proListingService.property = data.data;
        let url = this.saveNExit ? "host/property-list" : '/host/property-listing/short-term/short-term-pricing?proId=' + this.proListingService.getCurrentPropertyId() ;
        if(this.saveNExit){
          this.proListingService.property = null
        }
        this.router.navigateByUrl(url);
      });
  }

  back(): void {
    this.location.back();
  }

  get isValid():boolean{
    const amenityAndFacility: FormArray = this.amenityAndFacilityForm.get(
      'amenityAndFacility'
    ) as FormArray;
    
    let returnValue=amenityAndFacility.value.length>0
    console.log(returnValue)
    return returnValue
  }

  populateEditForm(pro_id:any) {
    this.apiService.post(environment.baseURL + ApiEndpoints.PROPERTY_EDIT_STEP4, {pro_id})
    .subscribe(
      data => {
        console.log(data);
        const amenityAndFacility: FormArray = this.amenityAndFacilityForm.get(
          'amenityAndFacility'
        ) as FormArray;
        
        
        data.data.forEach((element:any) => {
          let formValue=new FormControl(element.service_id)
          amenityAndFacility.push(formValue);
        });
        
        
        
      },
      error => {
        console.log(error);
      }
    );
  }

  populateFeilds() {
    const amenityAndFacility: FormArray = this.amenityAndFacilityForm.get(
      'amenityAndFacility'
    ) as FormArray;
    let data = this.proListingService.property.step_four;
    data.forEach((element:any) => {
      let formValue=new FormControl(element.service_id)
      amenityAndFacility.push(formValue);
    });
  }


}
