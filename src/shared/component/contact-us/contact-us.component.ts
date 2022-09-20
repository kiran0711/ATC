import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/shared/service/api.service';
import { ApiEndpoints } from 'src/shared/utils/api-url';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css'],
})
export class ContactUsComponent implements OnInit {
  contactUsForm: FormGroup;
  Images = [
    './assets/images/canada-flag.png',
    './assets/images/usa-flag.jpg',
    './assets/images/india-flag.png',
    './assets/images/uk-flag.png',
    './assets/images/AUSTRALIA-flag.png',
  ];

  SlideOptions = { items: 4, dots: false, nav: true };
  CarouselOptions = { items: 4, dots: false, nav: true };

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private toastr: ToastrService
  ) {
    this.contactUsForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      subject: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(500)]],
      contactNumber: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  get contactUsFormControl() {
    return this.contactUsForm.controls;
  }

  submitContactUsForm() {
    console.log(this.contactUsForm.value);
    const reqBody = {
      name: this.contactUsForm.value.name,
      email: this.contactUsForm.value.email,
      mobile: this.contactUsForm.value.contactNumber,
      subject: this.contactUsForm.value.subject,
      description: this.contactUsForm.value.description,
    };
    this.apiService
      .post(environment.baseURL + ApiEndpoints.CONTACT_US, reqBody)
      .subscribe(
        (data: any) => {
          console.log('data', data);
          this.toastr.success(data.message);
        },
        (error) => {
          // console.log('error', error.error);
          if (error.error.email) {
            this.contactUsForm.controls['email'].setErrors({
              incorrect: error.error.email,
            });
          }
          if (error.error.mobile) {
            this.contactUsForm.controls['contactNumber'].setErrors({
              incorrect: error.error.mobile,
            });
          }
          if (error.error.name) {
            this.contactUsForm.controls['name'].setErrors({
              incorrect: error.error.name,
            });
          }
          if (error.error.subject) {
            this.contactUsForm.controls['subject'].setErrors({
              incorrect: error.error.subject,
            });
          }
          if (error.error.description) {
            this.contactUsForm.controls['description'].setErrors({
              incorrect: error.error.description,
            });
          }
        }
      );
  }
}
