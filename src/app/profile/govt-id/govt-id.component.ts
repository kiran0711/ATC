import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/shared/service/api.service';
import { ApiEndpoints } from 'src/shared/utils/api-url';
import { SharedService } from 'src/shared/service/shared.service';

@Component({
  selector: 'app-govt-id',
  templateUrl: './govt-id.component.html',
  styleUrls: ['./govt-id.component.css'],
})
export class GovtIdComponent implements OnInit {
  govtIDForm: FormGroup;
  setLabel = 'Passport';
  editable: boolean = true;
  maskedDocNumber: any;
  docTypeName: string = '';
  fileName: any;
  docAvailable: boolean = false;
  docVerified: number = -1;
  docUrl: string = '';
  idFile: any;
  showSuccessMsg: boolean = false;
  successMsg: string = '';
  dataDocument = '';
  kycForm:FormGroup
  url:string
  countries:Array<any>=[]
  buttonText="Save Changes"
  qrCode:string
  kycStatus:any

  constructor(
    // private toastr: ToastrService,
    private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private apiService: ApiService
  ) {
    this.govtIDForm = this.formBuilder.group({
      documentType: ['Passport', [Validators.required]],
      documentNumber: ['', [Validators.required]],
    });

    this.kycForm = this.formBuilder.group({
      userid: [0, Validators.required],
      dialing_code: ['',Validators.required],
      contact_number: ['',Validators.required],
      name: ['' , Validators.required],
      country: ['',Validators.required],
      redirectURL:['',Validators.required]
    });
  }

  async ngOnInit() {
    this.setFormValues();

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

  isDocumentAvaialble(doc: any) {
    if (!doc) {
      return false;
    }
    return doc.document_type != null && doc.document_number != null;
  }

  setFormValues() {
    this.apiService
      .get(environment.baseURL + ApiEndpoints.GET_PROFILE_DETAIL)
      .subscribe((data: any) => {
        console.log('data', data.data);
        console.log('data', data.data.document);
        this.editable = !this.isDocumentAvaialble(data.data.document);
        this.docAvailable = data.data.document.document_path != null;
        if (data.data.document.document_proof) {
          this.dataDocument = data.data.document.document_proof;
          let first = data.data.document.document_proof
            .split('/')[2]
            .split('_')[0];
          let second = data.data.document.document_proof
            .split('/')[2]
            .split('.')[1];
          this.fileName = first + '.' + second;
        } else {
          this.fileName = '';
        }
        if (data.data.document.document_number) {
          let doc = data.data.document.document_number;
          this.maskedDocNumber =
            doc.substring(0, doc.length - 2).replace(/\d/g, '*') +
            doc.substring(doc.length - 2);
          this.docTypeName = data.data.document.document_type
            ? data.data.document.document_type
            : '';
          this.docVerified = data.data.document.document_is_verify
            ? data.data.document.document_is_verify
            : 0;
          this.docUrl = data.data.document.document_path;
        }
        this.govtIDForm.setValue({
          documentType: data.data.document.document_type
            ? data.data.document.document_type
            : '',
          documentNumber: data.data.document.document_number
            ? data.data.document.document_number
            : '',
        });
      });
  }

  selectFile(e: any) {
    this.idFile = e.target.files[0];
    this.fileName = this.idFile.name;
  }

  saveChanges() {
    if (this.govtIDForm.valid && this.fileName) {
      let formData = new FormData();
      formData.append('document_type', this.govtIDForm.value.documentType);
      formData.append('document_number', this.govtIDForm.value.documentNumber);
      formData.append('document_proof', this.idFile);
      //SAVE_PROFILE_INFO
      this.apiService
        .post(environment.baseURL + ApiEndpoints.SAVE_DOCUMENT_INFO, formData)
        .subscribe((data: any) => {
          this.editable = false;
          this.setFormValues();
          this.showSuccessMsg = true;
          this.successMsg = data.message;
        });
    }
  }

  changeName(e: any) {
    this.setLabel = e.target.value;
  }

  removeFile() {
    this.fileName = '';
  }

  editableForm() {
    console.log('fsd');
    this.editable = true;
    let first = this.dataDocument.split('/')[2].split('_')[0];
    let second = this.dataDocument.split('/')[2].split('.')[1];
    this.fileName = first + '.' + second;
  }

  viewOnlyForm() {
    this.editable = false;
  }

  getExternalImageFromURL() {
    window.open(this.docUrl);
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
}
