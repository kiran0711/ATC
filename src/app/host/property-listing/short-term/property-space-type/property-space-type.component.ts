import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/shared/service/api.service';
import { SharedService } from 'src/shared/service/shared.service';
import { ApiEndpoints } from 'src/shared/utils/api-url';
import { Location } from '@angular/common';
import { PropertyService } from '../property-listing.service';
@Component({
  selector: 'app-property-space-type',
  templateUrl: './property-space-type.component.html',
  styleUrls: ['./property-space-type.component.css'],
})
export class PropertySpaceTypeComponent implements OnInit {
  numberOfMonths = 1;
  numberOfDays = 1;
  propertySpaceTypeForm: FormGroup;
  typeOfSpace: any;
  typeOfProperty: any;
  imageUrl = environment.imageURL;
  saveNExit: boolean = false;
  isEdit: boolean = false;
  strLabel: string = "STR Number";
  pro_idd:any;

  constructor(
    private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
    public proListingService: PropertyService,
    private propertyListingService:PropertyService
  ) {
    
    this.propertySpaceTypeForm = this.formBuilder.group({
      available_for: [1, [Validators.required]],
      category_id: ['', [Validators.required]],
      property_type_id: ['', [Validators.required]],
      min_stay_in_night_for_str: [1, [Validators.required]],
      min_stay_in_month: [1],
      str_number: [''],
    });
  }

  async ngOnInit() {
    let resp:any = await this.apiService.postSync(environment.baseURL + ApiEndpoints.GET_PROPERTY_TYPES, {});
    this.typeOfSpace = resp.data.type_of_space;
    this.typeOfProperty = resp.data.property_type;
    
    let pro_id = this.route.snapshot.queryParamMap.get('proId');
    if (pro_id) {
      this.isEdit = true;
      await this.proListingService.getpropertyById(pro_id);
      this.populateFeilds();
    } else {
      this.router.navigateByUrl(this.proListingService.CREATE_PROPERTY_STEP_ONE);
      return;
    }

    let selectedCity=this.proListingService.property.step_zero.city
    let strCity=this.proListingService.property.str_cities.filter((city:any)=> city.city==selectedCity)
    if(strCity.length){
      this.propertyInfoFormControl['str_number'].validator = <any>Validators.compose([Validators.minLength(strCity[0].max_length),Validators.maxLength(strCity[0].max_length)]);               
    } else {                
      this.propertyInfoFormControl['str_number'].clearValidators();               
    }

// =============================SUMIT=======================================

this.pro_idd = this.activatedRoute.snapshot.queryParamMap.get('proId');
    console.log(this.pro_idd) 
    if(!this.pro_idd){
      const subscription = this.router.events.subscribe((val:any) => {
        // see also 
        // console.log(val) 
        this.pro_idd = this.propertyListingService.getCurrentPropertyId()
        if(this.pro_idd && val.url=='/host/property-listing/short-term/title'){
          this.router.navigateByUrl(val.url+"?proId="+this.pro_idd);
        }

        // subscription.unsubscribe()
    });
    }


//----------------------End ------------------------------------------------

    
  }

  get propertyInfoFormControl() {
    return this.propertySpaceTypeForm.controls;
  }

  setFormValues() {}

  addNumber(key?: string) {
    if (key === 'months') {
      let maxMinMonth = this.propertySpaceTypeForm.value.min_stay_in_month + 1;
      if (maxMinMonth >= 0 && maxMinMonth <= 60) {
        this.propertySpaceTypeForm.patchValue({
          min_stay_in_month:
            this.propertySpaceTypeForm.value.min_stay_in_month + 1,
        });
      }
    } else {
      let maxMinDay = this.propertySpaceTypeForm.value.min_stay_in_night_for_str + 1;
      if (maxMinDay >= 0 && maxMinDay <= 60) {
        this.propertySpaceTypeForm.patchValue({
          min_stay_in_night_for_str: this.propertySpaceTypeForm.value.min_stay_in_night_for_str + 1,
        });
      }
    }
  }

  removeNumber(key?: string) {
    if (key === 'months') {
      let maxMinMonth = this.propertySpaceTypeForm.value.min_stay_in_month - 1;
      if (maxMinMonth >= 0) {
        this.propertySpaceTypeForm.patchValue({
          min_stay_in_month:
            this.propertySpaceTypeForm.value.min_stay_in_month - 1,
        });
      }
    } else {
      let maxMinDay = this.propertySpaceTypeForm.value.min_stay_in_night_for_str - 1;
      if (maxMinDay >= 0) {
        this.propertySpaceTypeForm.patchValue({
          min_stay_in_night_for_str: this.propertySpaceTypeForm.value.min_stay_in_night_for_str - 1,
        });
      }
    }
  }

  saveAndExit(){
    this.saveNExit = true;
    this.next();
  }

  next() {
    console.log(this.propertySpaceTypeForm.value);
    let strNumber=this.propertySpaceTypeForm.value.str_number
    strNumber=strNumber?.trim()
    let proStepZero = this.proListingService.property.step_zero;
    const reqBody = {
      user_id: this.sharedService.getUserDetails().user_id,
      pro_id: proStepZero.pro_id,
      available_for: 1,
      category_id: this.propertySpaceTypeForm.value.category_id,
      min_stay_in_night_for_str: this.propertySpaceTypeForm.value.min_stay_in_night_for_str,
      min_stay_in_month: this.propertySpaceTypeForm.value.min_stay_in_month,
      str_number: strNumber,
      property_type_id: this.propertySpaceTypeForm.value.property_type_id
    };
    console.log('reqBody', reqBody);
    this.apiService
      .post(environment.baseURL + ApiEndpoints.PROPERTY_STEP1, reqBody)
      .subscribe((data: any) => {
        this.proListingService.property = data.data;
        if(this.saveNExit){
          this.proListingService.property = null
        }
        this.router.navigateByUrl(this.saveNExit ? "host/property-list" : '/host/property-listing/short-term/describe-property?proId=' + this.proListingService.property.step_one.pro_id);
      });
  }

  back(): void {
    this.location.back();
  }

  populateFeilds(){
    let selectedCity=this.proListingService.property.step_zero.city
    let strCity=this.proListingService.property.str_cities.find((city:any)=> city.city.toLowerCase()==selectedCity.toLowerCase());
    this.strLabel = strCity ? strCity.label : "";
    let data = this.proListingService.property.step_one;
    if( Array.isArray(data)){
      return
    }
    // if (this.proListingService.property.str_number_required) {
    //   this.propertySpaceTypeForm.controls['str_number'].addValidators(Validators.required);
    // }
    
    this.propertySpaceTypeForm.setValue({
      available_for: data.available_for,
      category_id: data.category_id?data.category_id:'',
      min_stay_in_night_for_str: data.min_stay_in_night_for_str==null?1: parseInt(data.min_stay_in_night_for_str),
      min_stay_in_month: data.min_stay_in_month==null?1:data.min_stay_in_month,
      str_number: strCity ? data.str_number : "",
      property_type_id: data.property_type_id==null?'':data.property_type_id
    });
  }

  checkStrValidation():boolean{
    if(this.proListingService.property){
      let selectedCity=this.proListingService.property.step_zero.city
      let strCity=this.proListingService.property.str_cities.filter((city:any)=> city.city.toLowerCase()==selectedCity.toLowerCase())
      if(!strCity.length){
        return false;
      }
      if(this.propertyInfoFormControl['min_stay_in_night_for_str'].value <= strCity[0].min_stay_days){
        return true;
      }
    }
    
    return false;
  }

}
