import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../../shared/service/api.service';
import { SharedService } from '../../../shared/service/shared.service';
import { environment } from 'src/environments/environment';
import { ApiEndpoints } from 'src/shared/utils/api-url';
import * as CONSTANTS from 'src/app/app.constants';

@Component({
  selector: 'app-referals',
  templateUrl: './referals.component.html',
  styleUrls: ['./referals.component.css']
})
export class ReferalsComponent implements OnInit {
  // referalForm: FormGroup;
  referals:Array<any>=[];
  referForm:FormGroup;
  error:any;
  referalCode:any;
  referal:any;
  constructor(private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private apiService: ApiService) {
    this.referForm=this.formBuilder.group({
      email:['',[Validators.required,Validators.email]],
    });
  }

  ngOnInit(): void {
    // this.referalForm = this.formBuilder.group({
    //   referalCode: ['', [Validators.required]],
    // });
    this.getReferals();

    $(document).on('shown.bs.modal', '#referals', () => {
      this.error=null
    });
  }

  getReferals() {
    let req={user_id:this.sharedService.getUserDetails().user_id}
    this.apiService.post(environment.baseURL + ApiEndpoints.GET_REFERALS, req)
      .subscribe(
        (data) => {
          console.log(data);

          this.referal = data.data;
        },
        (error) => {
          console.log(error);
          this.referals=[];
        }
      );
  }

  get referalControl () {
    return this.referForm.controls
  }

  sendReferal(){
    // debugger
    if(this.referForm.get('email')==null){
      return
    }
    
    let reqObj:any={}
    reqObj.user_id=this.sharedService.getUserDetails().user_id;
    reqObj.email=this.referForm.get('email')?.value;
    // reqObj.referal_id=this.referalCode;
    console.log(reqObj)
    this.apiService.post(environment.baseURL + ApiEndpoints.INVITE_PEOPLE,reqObj )
      .subscribe(
        (resp) => {
          console.log(resp)
          document.getElementById('closeReferModel')?.click();
          this.referForm.controls['email'].setValue('');
        },(error) => {
          this.error=error.message
          console.log(error);
        }
      );
  }

  selectPromocode(code:any){
    this.referalCode=code;
  }

}
