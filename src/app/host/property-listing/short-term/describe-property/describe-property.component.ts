import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/shared/service/api.service';
import { SharedService } from 'src/shared/service/shared.service';
import { ApiEndpoints } from 'src/shared/utils/api-url';
import { Location } from '@angular/common';
import { PropertyService } from '../property-listing.service';

@Component({
  selector: 'app-describe-property',
  templateUrl: './describe-property.component.html',
  styleUrls: ['./describe-property.component.css'],
})
export class DescribePropertyComponent implements OnInit {
  attributes = [];
  intialVal: boolean = false;
  attributeValue = 0;
  describePropertyForm: FormGroup;
  currentLength = 0;
  saveNExit: boolean = false;
  isEdit: boolean = false;
  pro_idd:any;

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
    this.describePropertyForm = this.fb.group({
      property_description: ['', [Validators.minLength(100), Validators.maxLength(2000), Validators.required ]],
    });
  }

  async ngOnInit() {

    let pro_id = this.route.snapshot.queryParamMap.get('proId');
    if (pro_id) {
      this.isEdit = true;
      await this.proListingService.getpropertyById(pro_id);
      if(!this.proListingService.getCurrentPropertyCategory()){
        let url=pro_id?this.proListingService.CREATE_PROPERTY_STEP_TWO+"?proId="+pro_id :this.proListingService.CREATE_PROPERTY_STEP_TWO
        this.router.navigateByUrl(url);
        return
      }
      let req = {category_id: this.proListingService.property.step_one.category_id,property_term:0};
      let resp:any = await this.apiService.postSync(environment.baseURL + ApiEndpoints.ATTRIBUTES_LIST, req);
      this.attributes = resp.data.discribe_your_property;
      this.initDescribeForm();
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
        if(this.pro_idd && val.url=='/host/property-listing/short-term/property-space-type'){
          this.router.navigateByUrl(val.url+"?proId="+this.pro_idd);
        }

        // subscription.unsubscribe()
    });
    }


//----------------------End ------------------------------------------------


  }

  initDescribeForm(){
    this.attributes.forEach((x:any) => {
      this.describePropertyForm.addControl(
        x['attr_key'],
        new FormControl(x['min_val'])
      );
    });
    this.describePropertyForm
    .get('property_description')
    ?.valueChanges.subscribe((val) => {
      this.currentLength = val.length;
    });
  }

  allowSharing(e: any) {
    console.log(e.target.checked);
  }

  decrease(minVal: any, setAttrName: string) {
    let decrement = setAttrName.toLocaleLowerCase() == 'baths' ? 0.5 : 1 ;
    if (this.describePropertyForm.controls[setAttrName].value > minVal) {
      this.describePropertyForm.controls[setAttrName].setValue(
        this.describePropertyForm.value[setAttrName] - decrement
      );
    }
  }

  increase(maxVal: any, setAttrName: string) {
    let increment = setAttrName.toLocaleLowerCase() == 'baths' ? 0.5 : 1 ;
    if (this.describePropertyForm.controls[setAttrName].value < maxVal) {
      this.describePropertyForm.controls[setAttrName].setValue(
        this.describePropertyForm.value[setAttrName] + increment
      );
    }
  }

  get propertyDescribeFormControl() {
    return this.describePropertyForm.controls;
  }

  saveAndExit(){
    this.saveNExit = true;
    this.next();
  }

  next() {
    console.log(this.describePropertyForm.value);
    let reqArray: any = [];
    for (const property in this.describePropertyForm.value) {
      console.log(this.describePropertyForm.value[property]);
      reqArray.push({
        [property.toLowerCase().replace(' ', '_')]:
          this.describePropertyForm.value[property],
      });
    }
    reqArray.push({ user_id: this.sharedService.getUserDetails().user_id });
    reqArray.push({ pro_id: this.proListingService.getCurrentPropertyId() });

    let result: any = {};
    for (let i = 0; i < reqArray.length; i++) {
      result[Object.keys(reqArray[i])[0]] =
        reqArray[i][Object.keys(reqArray[i])[0]];
    }

    console.log(result);
    this.apiService
      .post(environment.baseURL + ApiEndpoints.PROPERTY_STEP2, result)
      .subscribe((data: any) => {
        this.proListingService.property = data.data;
        if(this.saveNExit){
          this.proListingService.property = null
        }
        this.router.navigateByUrl(this.saveNExit ? "host/property-list" : '/host/property-listing/short-term/more-details?proId=' + this.proListingService.getCurrentPropertyId() );
      });
  }

  back(): void {
    this.location.back();
  }

  populateFeilds(){
    let data = this.proListingService.property.step_two;
    this.attributes.forEach((attr:any) => {
      let attrName = attr['attr_key'] ? attr['attr_key'] : '';
      let attrKey = attrName.toLowerCase().replace(' ', '_');
      let value = data[attrKey];
      value = value ? value : (attr['min_val']?attr['min_val']:0)
      this.describePropertyForm.controls[attrName].setValue(value);
    });
    if(data['property_description'])
    this.describePropertyForm.controls['property_description'].setValue(data['property_description']);
  }
}
