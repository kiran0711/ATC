import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../../shared/service/api.service';
import { SharedService } from '../../../shared/service/shared.service';
import { environment } from 'src/environments/environment';
import { ApiEndpoints } from 'src/shared/utils/api-url';
import * as CONSTANTS from 'src/app/app.constants';

@Component({
  selector: 'app-tax-info',
  templateUrl: './tax-info.component.html',
  styleUrls: ['./tax-info.component.css']
})
export class TaxInfoComponent implements OnInit {
  // referalForm: FormGroup;
  referals:Array<any>=[];
  hst_number:any;
  error:any;
  referalCode:any;
  referal:any;
  constructor(private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private apiService: ApiService) {
   
  }

  ngOnInit(): void {
    this.getProfileData();
  }

  getProfileData() {
    this.apiService
    .get(environment.baseURL + ApiEndpoints.GET_PROFILE_DETAIL)
    .subscribe((data: any) => {
          console.log(data);

          this.hst_number = data.data.hst_number;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  

  saveHSTNumber(){
    // debugger
    if(this.hst_number.trim() == ''){
      return
    }
    
    let reqObj:any={}
    reqObj.user_id=this.sharedService.getUserDetails().user_id;
    reqObj.hst_number=this.hst_number;
    // reqObj.referal_id=this.referalCode;
    console.log(reqObj)
    this.apiService.post(environment.baseURL + ApiEndpoints.POST_HST_NUMBER, reqObj )
      .subscribe(
        (resp) => {
          console.log(resp)
        },(error) => {
          this.error=error.message
          console.log(error);
        }
      );
  }

}
