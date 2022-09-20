import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/shared/service/api.service';
import { SharedService } from 'src/shared/service/shared.service';
import { ApiEndpoints } from 'src/shared/utils/api-url';
import * as CONSTANTS from 'src/app/app.constants';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { PropertyService } from '../property-listing.service';

@Component({
  selector: 'app-more-details',
  templateUrl: './more-details.component.html',
  styleUrls: ['./more-details.component.css'],
})
export class MoreDetailsComponent implements OnInit {
  attributes: any;
  moreDetailForm: FormGroup;
  checkInOutTime = CONSTANTS.TIME;
  saveNExit: boolean = false;
  isEdit: boolean = false;
  pro_idd:any;


  convertTime12to24 = (time12h:any) => {
    let currentDate=new Date().toISOString().slice(0, 10)
    let modifier=0
    if(time12h.includes("-PM")){
      modifier=12
    }
    let timeArray=time12h.replaceAll("-AM","").replaceAll("-PM","").split(":")
    let time=(parseInt(timeArray[0])+modifier).toString()+":"+timeArray[1]
    var d = new Date(currentDate +" " + time); 
    return d;
  }

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
    this.moreDetailForm = this.fb.group({
      guest_notify_before_arrive_time: [''],
      check_in_time: ['', [Validators.required]],
      check_out_time: ['', [Validators.required]],
      ruleArray: this.fb.array([this.fb.control('')]),
    });
  }

  get moreDetailFormControl() {
    return this.moreDetailForm.controls;
  }

  get ruleArray() {
    return this.moreDetailForm.get('ruleArray') as FormArray;
  }

  get notifyCheck(){
    let value=this.moreDetailFormControl['guest_notify_before_arrive']
    return value?value.value:false;
  }

  checkDynamicFeild(name:any){
    if(name=="min_stay_in_days" && this.moreDetailFormControl["set_min_stay"] && !this.moreDetailFormControl["set_min_stay"].value){
      return 0
    }
    if(name=="max_stay_in_days" && this.moreDetailFormControl["set_max_stay"] && !this.moreDetailFormControl["set_max_stay"].value){
      return 0
    }
    if(name=="guests_allowed" && this.moreDetailFormControl["set_max_stay"] && !this.moreDetailFormControl["set_max_stay"].value){
      return 0
    }
    if(name=="max_additional_guest_allow" && this.moreDetailFormControl["additional_guest_allow"] && !this.moreDetailFormControl["additional_guest_allow"].value){
      return 0
    }
    return 1
  }

  async ngOnInit() {
    let pro_id = this.route.snapshot.queryParamMap.get('proId');
    if (pro_id) {
      this.isEdit = true;
      await this.proListingService.getpropertyById(pro_id);
      await this.initAttributeList();
      this.populateFeilds();
    } else {
      this.router.navigateByUrl(this.proListingService.CREATE_PROPERTY_STEP_ONE);
      return;
    }
    await this.initAttributeList();    
  }

  async initAttributeList() {
    if(!this.proListingService.getCurrentPropertyCategory()){
      let pro_id=this.proListingService.getCurrentPropertyId()
      let url=pro_id?this.proListingService.CREATE_PROPERTY_STEP_TWO+"?proId="+pro_id :this.proListingService.CREATE_PROPERTY_STEP_TWO
      this.router.navigateByUrl(url);
      return
    }
    let req = {category_id: this.proListingService.getCurrentPropertyCategory(),property_term:0};
    let resp:any = await this.apiService.postSync(environment.baseURL + ApiEndpoints.ATTRIBUTES_LIST, req);
    this.attributes = resp.data.more_details;
    this.attributes.forEach((x: any) => {
      this.moreDetailForm.addControl(
        x['attr_key'],
        new FormControl(x['min_val'])
      );
    });



    // =============================SUMIT=======================================

this.pro_idd = this.activatedRoute.snapshot.queryParamMap.get('proId');
console.log(this.pro_idd) 
if(!this.pro_idd){
  const subscription = this.router.events.subscribe((val:any) => {
    // see also 
    // console.log(val) 
    this.pro_idd = this.propertyListingService.getCurrentPropertyId()
    if(this.pro_idd && val.url=='/host/property-listing/short-term/describe-property'){
      this.router.navigateByUrl(val.url+"?proId="+this.pro_idd);
    }

    // subscription.unsubscribe()
});
}


//----------------------End ------------------------------------------------
  }

  decrease(minVal: any, setAttrName: string) {
    if (this.moreDetailForm.controls[setAttrName].value > minVal) {
      this.moreDetailForm.controls[setAttrName].setValue(
        this.moreDetailForm.value[setAttrName] - 1
      );
    }
  }

  increase(maxVal: any, setAttrName: string) {
    if (this.moreDetailForm.controls[setAttrName].value < maxVal) {
      let old = this.moreDetailForm.value[setAttrName];
      old = new Number(old);
      this.moreDetailForm.controls[setAttrName].setValue(old + 1);
    }
  }

  addRule() {
    if (this.ruleArray.length < 10) {
      this.ruleArray.push(this.fb.control(''));
    }
  }

  removeRule(index:any) {
    if (this.ruleArray.length > 1) {
      this.ruleArray.removeAt(index)
    }
  }

  saveAndExit(){
    this.saveNExit = true;
    this.next();
  }

  validateCheckinTime() {
    let format = 'h:mm-A';
    let start = moment(this.moreDetailForm.value.check_out_time, format);
    let end = moment(this.moreDetailForm.value.check_in_time, format);
    let diff = moment.duration(end.diff(start));
    let diffMinutes = diff.asMinutes();
    
    if (diffMinutes < 60 || start.get('hour') > 22) {
      this.moreDetailFormControl['check_out_time'].setErrors({
        incorrect: "Check-Out time must be atleast 1 hour before Check-In time and should not be after 22:00",
      });
      this.moreDetailFormControl['check_in_time'].setErrors({
        incorrect: "Check-In time must be atleast 1 hour after Check-Out time",
      });
    } else {
      this.moreDetailFormControl['check_out_time'].setErrors(null);
      this.moreDetailFormControl['check_in_time'].setErrors(null);
    }
    console.log(diff.minutes());
  }

  next() {
    let reqBody: any = {};
    for (const property in this.moreDetailForm.value) {
      let attrObj:any = this.attributes.find((o:any) => {return o.attr_key === property});
      if (attrObj) {
        switch (attrObj['input_type']) {
          case 'range':
            reqBody[property] = this.moreDetailForm.value[property];// || false;
            break;
          case 'toggle':
            reqBody[property] = this.moreDetailForm.value[property] ? 1 : 0
            break;
          default:
            console.warn('Ignoring attribute '+property+" input_type is not defined")
            break;
        }
      }
    }
    reqBody['check_in_time'] = this.moreDetailForm.value.check_in_time;
    reqBody['check_out_time'] = this.moreDetailForm.value.check_out_time;
    reqBody['rules'] = this.moreDetailForm.value.ruleArray;
    reqBody['user_id'] = this.sharedService.getUserDetails().user_id;
    reqBody['pro_id'] = this.proListingService.getCurrentPropertyId();
    reqBody['guest_notify_before_arrive_time'] = this.moreDetailForm.value.guest_notify_before_arrive_time;
    this.apiService
      .post(environment.baseURL + ApiEndpoints.PROPERTY_STEP3, reqBody)
      .subscribe((data: any) => {
        console.log('data', data);
        this.proListingService.property = data.data;
        let url = this.saveNExit ? "host/property-list" : '/host/property-listing/short-term/amenities?proId=' + this.proListingService.getCurrentPropertyId();
        if(this.saveNExit){
          this.proListingService.property = null
        }
        this.router.navigateByUrl(url);
      });
  }

  back(): void {
    this.location.back();
  }

  populateFeilds() {
    let data = this.proListingService.property.step_three;
    this.attributes.forEach((x: any) => {
      let setAttrName = x['attr_key'];
      let val = data[setAttrName];
      val = val ? val : x['min_val'];
      this.moreDetailForm.controls[setAttrName].setValue(val);      
    });
    this.moreDetailForm.controls['guest_notify_before_arrive_time'].setValue(data['guest_notify_before_arrive_time']);
    this.moreDetailForm.controls['check_in_time'].setValue(data['check_in_time']);
    this.moreDetailForm.controls['check_out_time'].setValue(data['check_out_time']);

    let rules=data['propertyRules']
    if(rules.length){
      let formArray = this.moreDetailForm.controls['ruleArray'] as FormArray;
      while (formArray.length !== 0) {
        formArray.removeAt(0)
      }
      rules.forEach((element:any, i:number) => {
        formArray.push(this.fb.control(element.rule));
      });
    }
  }
}
