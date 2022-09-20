import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/shared/service/shared.service';
import { ApiService } from 'src/shared/service/api.service';
import { ApiEndpoints } from 'src/shared/utils/api-url';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-kyc',
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.css']
})
export class KycComponent implements OnInit {
  kycForm:FormGroup
  url:string
  countries:Array<any>=[]
  buttonText="Save Changes"
  qrCode:string
  kycStatus:any
  constructor(private router: Router,
    private sharedService: SharedService,
    private apiService: ApiService,
    private fb: FormBuilder) {
      this.kycForm = this.fb.group({
        userid: [0, Validators.required],
        dialing_code: ['',Validators.required],
        contact_number: ['',Validators.required],
        name: ['' , Validators.required],
        country: ['',Validators.required],
        redirectURL:['',Validators.required]
      });

  }

  async ngOnInit() {
    this.kycStatus=this.sharedService.getUserDetails().kyc_status

    if(this.kycStatus!=0){
      let reqBody={
        "user_id": this.sharedService.getUserDetails().user_id.toString()
        // "user_id":11
      }
      let resp:any = await this.apiService.postSync(environment.baseURL + ApiEndpoints.GET_KYC_STATUS, reqBody).catch((error)=>{
        console.log(error)
        this.populateFormStatic()
      }).then((resp:any)=>{
        if(!resp){
          return
        }
        this.populateFormDynamic(resp)
        if(resp.data.status=='failed'){
          this.kycStatus=2  
        }else if(resp.data.status=='verified'){
          this.kycStatus=1
        }

        if(this.kycStatus==3||this.kycStatus==2){
          this.qrCode= resp.data.qrCode?"data:image/png;base64,"+resp.data.qrCode:""
          this.url=resp.data.verificationLink
        }
        let user=this.sharedService.getUserDetails();
        user.kyc_status=this.kycStatus;
        localStorage.setItem('userdata', JSON.stringify(user));
        if(this.kycStatus==1 || this.kycStatus==3){
          this.kycForm.controls['dialing_code'].disable()
          this.kycForm.controls['contact_number'].disable()
          this.kycForm.controls['name'].disable()
          this.kycForm.controls['country'].disable()
        }

        if(this.kycStatus==3){
          this.buttonText="Resend"
        }else{
          this.buttonText="Save Changes"
        }
      })
      
      
      
      
    }else{
      this.populateFormStatic()
    }
    // this.url=environment.imageURL
    this.countries=this.sharedService.getCountries()
  }

  

  populateFormStatic(){
    this.kycForm.setValue({
      userid: this.sharedService.getUserDetails().user_id,
      dialing_code:'',
      contact_number:'',
      name: this.sharedService.getUserDetails().firstname + ' ' + this.sharedService.getUserDetails().lastname,
      country: '',
      redirectURL: window.location.href,
    });
  }

  populateFormDynamic(resp:any){
    this.kycForm.setValue({
      userid: this.sharedService.getUserDetails().user_id,
      dialing_code:resp.data.dialing_code,
      contact_number:resp.data.mobile,
      name: resp.data.name,
      country: resp.data.country,
      redirectURL: window.location.href,
    });
  }

  get kycFormControl(){
    return this.kycForm.controls
  }

  dirty(control:any){
    this.kycFormControl[control].markAsDirty()
  }

  get checkButtonEnabled():boolean{
    if(localStorage.getItem('lastSent')){
      let kycStatus=this.sharedService.getUserDetails().kyc_status
      var startTime = new Date(localStorage.getItem('lastSent') as string); 
      var endTime = new Date();
      var difference = endTime.getTime() - startTime.getTime(); // This will give difference in milliseconds
      var resultInMinutes = Math.round(difference / 60000);
      if(resultInMinutes>15 && kycStatus!=1){
        return true
      }
      return false
    }
    return true
  }

  save(){
    console.log("DATA",this.kycForm.controls)
    let reqBody={
      "user_id": this.kycFormControl['userid'].value,
      "dialing_code":this.kycFormControl['dialing_code'].value,
      "mobile":  this.kycFormControl['contact_number'].value,
      "name": this.kycFormControl['name'].value,
      "country": this.kycFormControl['country'].value,
      "redirectURL": this.kycFormControl['redirectURL'].value
    }
    console.log(reqBody)
    this.apiService
      .post(environment.baseURL + ApiEndpoints.UPDATE_KYC, reqBody)
      .subscribe((resp: any) => {
        localStorage.setItem('lastSent',new Date().toJSON());
        this.qrCode= resp.data.qrCode?"data:image/png;base64,"+resp.data.qrCode:""
        this.url=resp.data.verificationLink
        let user=this.sharedService.getUserDetails();
        if(user.kyc_status==0){
          user.kyc_status=3;
          localStorage.setItem('userdata', JSON.stringify(user));
        }
        
      });
  }

  // verfy(){
  //   console.log("DATA",this.kycForm.controls)
  //   let reqBody={
  //     "user_id": this.sharedService.getUserDetails().user_id
  //   }
  //   console.log(reqBody)
  //   this.apiService
  //     .post(environment.baseURL + ApiEndpoints.GET_KYC_STATUS, reqBody)
  //     .subscribe((data: any) => {
  //         this.buttonText="Resend"
  //     });
  // }

}
