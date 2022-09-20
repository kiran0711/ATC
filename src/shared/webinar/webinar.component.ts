import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/shared/service/api.service';
import { ApiEndpoints } from '../utils/api-url';

@Component({
  selector: 'app-webinar',
  templateUrl: './webinar.component.html',
  styleUrls: ['./webinar.component.css']
})
export class WebinarComponent implements OnInit {

  formGroup: FormGroup;
  submitted: boolean = false;


  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private toastr: ToastrService
  ) {
  
  }
  ngOnInit(): void {

    this.formGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
    });
    
  }
  get formGroupControl() {
    return this.formGroup.controls;
  }

 onSubmit() {
  this.submitted = true;

		if (!this.formGroup.valid) {
			return;
		}

    const reqBody = {
      name: this.formGroup.value.name,
      email: this.formGroup.value.email,
    };
    this.apiService
      .post(environment.baseURL + ApiEndpoints.APPLY_FOR_WEBINAR, reqBody)
      .subscribe(
        (data: any) => {
          this.toastr.success(data.message);
          this.formGroup.reset()
          this.submitted = false;
        },
        (error) => {
          this.toastr.error(error.message);
        }
      );

    
  }
}
