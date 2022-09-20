import { Component, OnInit,Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/shared/service/api.service';
import { SharedService } from 'src/shared/service/shared.service';
import { ApiEndpoints } from 'src/shared/utils/api-url';
import { PropertyService } from '../property-listing.service';
import { Router,ActivatedRoute } from '@angular/router';
declare var $: any 

@Component({
  selector: 'property-publish-modal',
  templateUrl: './publish-modal.component.html',
  styleUrls: ['./publish-modal.component.css']
})
export class PublishModalComponent implements OnInit {
  isStrMandatorty=false
  applyLink:string=""
  publishForm:FormGroup
  property:any
  showStrBlock:any=false
  @Output() emitter: EventEmitter<any> = new EventEmitter();
  constructor(private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    public proListingService: PropertyService,
    private router:Router,
    private route:ActivatedRoute,
    ) { 
      this.publishForm = this.formBuilder.group({
        str_number: [''],
        agreed: [false, Validators.requiredTrue]
      });
    }

  async ngOnInit() {
    let pro_id = this.route.snapshot.queryParamMap.get('proId');
    if (pro_id) {
     await this.proListingService.getpropertyById(pro_id);
    }
    if (!this.proListingService.property) {
      this.router.navigateByUrl('/host/property-listing/short-term/title');
      return;
    }

    let selectedCity=this.proListingService.property.step_zero.city
      let strCity=this.proListingService.property.str_cities.filter((city:any)=> city.city.toLowerCase()==selectedCity.toLowerCase())
      if(!strCity.length){
        this.isStrMandatorty=false;
        this.applyLink="";
      }else{
        let minStay=this.proListingService.property.step_one.min_stay_in_night_for_str
        let minStayCity=strCity[0].min_stay_days
        this.isStrMandatorty=parseInt(minStay)<=parseInt(minStayCity);
        this.applyLink=strCity[0].link;
        if(this.isStrMandatorty){
          this.publishForm.controls['str_number'].setValidators([Validators.required,Validators.minLength(strCity[0].max_length),Validators.maxLength(strCity[0].max_length)])
          this.publishForm.controls['str_number'].setValue(this.proListingService.property.publish_step.str_number)
          this.publishForm.controls['str_number'].updateValueAndValidity()
        }
        
      }
    // this.isStrMandatorty=this.proListingService.property.str_number_required;
    
  
    
  }

  updateCheckBoxVal(event:any) {
    console.log(event)
  }

  

  get publishFormControl() {
    return this.publishForm.controls;
  }

  submit(){
    //jQuery\.noConflict\(\);
    $('#additional_details').modal('hide');
    let data:any={}
    data.str=this.publishFormControl['str_number'].value
    data.agree=this.publishFormControl['agreed'].value
    this.emitter.emit(data)
  }

  strVisiblity(visiblity:any){
    this.showStrBlock=visiblity
    if(!visiblity){
      this.publishForm.controls['str_number'].setValue(this.proListingService.property.publish_step.str_number)
    }
  }

}
