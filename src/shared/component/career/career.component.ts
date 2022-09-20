import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/shared/service/api.service';
import { ApiEndpoints } from 'src/shared/utils/api-url';

@Component({
  selector: 'app-career',
  templateUrl: './career.component.html',
  styleUrls: ['./career.component.css']
})
export class CareerComponent implements OnInit {
  jobTitle:string;
  careerForm: FormGroup;
  careerFormSuccess = false;
  careerFormFailed = false;
  successMsg: any = "";
  failedMsg:any = "";
  idFile: any;
  fileName: any;

  constructor(private formBuilder: FormBuilder, private apiService: ApiService) {
    this.careerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(150)]],
      email: ['', [Validators.required, Validators.maxLength(150)]],
      mobile: ['', [Validators.required, Validators.maxLength(20)]],
      location: ['', [Validators.required]],
      linkedin_url: [''],
      resume: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
  }

  applyNowOpenModel(e:any, job_title:string){
    this.jobTitle = job_title;
    this.careerForm.setValue({
      "name":"",
      "email":"",
      "mobile":"",
      "location":"",
      "linkedin_url":"",
      "resume":"",
    });
  }

  get applyNowFormControl(){
    return this.careerForm.controls;
  }

  selectFile(e: any) {
    this.idFile = e.target.files[0];
    this.fileName = this.idFile.name;
  }

  sendCareerForm(){
    if (this.careerForm.valid && this.fileName) {
      let formData = new FormData();
      formData.append('job_role', this.jobTitle);
      formData.append('name', this.careerForm.value.name);
      formData.append('email', this.careerForm.value.email);
      formData.append('mobile', this.careerForm.value.mobile);
      formData.append('location', this.careerForm.value.location);
      formData.append('linkedin_url', this.careerForm.value.linkedin_url);
      formData.append('resume', this.idFile);

      this.apiService
      .post(environment.baseURL + ApiEndpoints.CAREER_FORM, formData)
      .subscribe((data: any) => {
        this.careerFormSuccess = true;
        this.successMsg = data.message;
        setTimeout(()=>{ this.careerFormSuccess = false}, 5000);
      },
      (error) => {
        console.log(error);
        if (error.error.name) {
          this.careerForm.controls['name'].setErrors({
            incorrect: error.error.name,
          });
        }else if (error.error.email) {
          this.careerForm.controls['email'].setErrors({
            incorrect: error.error.email,
          });
        }else if (error.error.mobile) {
          this.careerForm.controls['mobile'].setErrors({
            incorrect: error.error.mobile,
          });
        }else if (error.error.location) {
          this.careerForm.controls['location'].setErrors({
            incorrect: error.error.location,
          });
        }else if (error.error.linkedin_url) {
          this.careerForm.controls['linkedin_url'].setErrors({
            incorrect: error.error.linkedin_url,
          });
        }else if (error.error.resume) {
          this.careerForm.controls['resume'].setErrors({
            incorrect: error.error.resume,
          });
        }else{
          this.careerFormFailed = true;
          this.failedMsg = error.message;
          setTimeout(()=>{ this.careerFormFailed = false}, 5000);
        }
      });
    }
  }
}