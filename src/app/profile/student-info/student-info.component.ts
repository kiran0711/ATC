import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/shared/service/api.service';
import { SharedService } from 'src/shared/service/shared.service';
import { ApiEndpoints } from 'src/shared/utils/api-url';
import * as CONSTANTS from 'src/app/app.constants';
import * as moment from 'moment';
@Component({
  selector: 'app-student-info',
  templateUrl: './student-info.component.html',
  styleUrls: ['./student-info.component.css'],
})
export class StudentInfoComponent implements OnInit {
  studentInfoForm: FormGroup;
  successMsg: string = '';
  showSuccessMsg: boolean = false;
  sameAddress: boolean = false;
  universityName: string = '';
  dialingCode: string = '';
  selectCheckbox: boolean = false;
  showStatusMsg: boolean = false;
  statusMsg: string = "";

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private sharedService: SharedService
  ) {
    this.studentInfoForm = this.formBuilder.group({
      university: ['', [Validators.required]],
      program: ['', [Validators.required]],
      course_duration: ['', [Validators.required]],
      guardian_name: ['', [Validators.required]],
      guardian_email: ['', [Validators.required]],
      guardian_dialing_code: ['', [Validators.required]],
      guardian_contact_number: ['', [Validators.required]],
      guardian_relationship: ['', [Validators.required]],
      educational_loan: [true],
      scholarship: [''],
      guardian_address: [false],
      address_line_1: ['', Validators.required],
      address_line_2: [''],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
      county: [''],
      zipcode: ['', [Validators.required]],
      landmark: [''],
    });
  }

  get studentInfoFormControl() {
    return this.studentInfoForm.controls;
  }

  ngOnInit(): void {
    this.setFormValues();

    
  }

  setFormValues() {
    this.apiService
      .get(environment.baseURL + ApiEndpoints.GET_PROFILE_DETAIL)
      .subscribe((data: any) => {
        console.log('student', data.data.student);
        console.log('university', data.data.guardian);
        data.data.guardian.university
          ? (this.universityName = data.data.guardian.university)
          : '';

        data.data.guardian.guardian_dialing_code
          ? (this.dialingCode = data.data.guardian.guardian_dialing_code)
          : '';
        if (data.data.student) {
          this.studentInfoForm.patchValue({
            university: data.data.student.university,
            program: data.data.student.program,
            course_duration: new Date(
              moment(data.data.student.course_duration).format('MM-DD-YYYY')
            ),
            guardian_name: data.data.guardian.guardian_name,
            guardian_email: data.data.guardian.guardian_email,
            guardian_dialing_code: data.data.guardian.guardian_dialing_code,
            guardian_contact_number: data.data.guardian.guardian_contact_number,
            guardian_relationship: data.data.student.guardian_relationship,
            educational_loan: data.data.student.educational_loan == 1,
            scholarship: data.data.student.scholarship,
            address_line_1: data.data.guardian.address_line_1,
            address_line_2: data.data.guardian.address_line_2,
            city: data.data.guardian.city,
            state: data.data.guardian.state,
            country: data.data.guardian.country,
            county: data.data.guardian.county,
            zipcode: data.data.guardian.zipcode,
            landmark: data.data.guardian.landmark,
            guardian_address: data.data.guardian.zipcode == data.data.address.zipcode
          });
          this.sameAddress = data.data.guardian.zipcode == data.data.address.zipcode;
        }
      });
  }

  displayAddress() {
    this.sameAddress = !this.sameAddress;
  }

  saveChanges() {
    if (this.studentInfoForm.valid) {
      let req = {
        university: this.studentInfoForm.value.university,
        program: this.studentInfoForm.value.program,
        course_duration: moment(
          new Date(this.studentInfoForm.value.course_duration)
        ).format(CONSTANTS.DOB_API_FORMAT),
        guardian_name: this.studentInfoForm.value.guardian_name,
        guardian_email: this.studentInfoForm.value.guardian_email,
        guardian_dialing_code: this.studentInfoForm.value.guardian_dialing_code,
        guardian_contact_number:
          this.studentInfoForm.value.guardian_contact_number,
        guardian_relationship: this.studentInfoForm.value.guardian_relationship,
        educational_loan: this.studentInfoForm.value.educational_loan ? 1 : 0,
        scholarship: this.studentInfoForm.value.scholarship,
        guardian_address: this.studentInfoForm.value.guardian_address ? 1 : 0,
        address_line_1: this.studentInfoForm.value.address_line_1,
        address_line_2: this.studentInfoForm.value.address_line_2,
        city: this.studentInfoForm.value.city,
        state: this.studentInfoForm.value.state,
        country: this.studentInfoForm.value.country,
        zipcode: this.studentInfoForm.value.zipcode,
        landmark: this.studentInfoForm.value.landmark,
        county: this.studentInfoForm.value.county,
      };
      console.log(req);
      this.apiService
        .post(environment.baseURL + ApiEndpoints.SAVE_STUDENT_INFO, req)
        .subscribe(
          (data: any) => {
            this.setFormValues();
            this.statusMsg = data.message;
            this.showStatusMsg = true;
          },
          (error) => {
            if (error.error.university) {
              this.studentInfoForm.controls['university'].setErrors({
                incorrect: error.error.university,
              });
            }
            if (error.error.program) {
              this.studentInfoForm.controls['program'].setErrors({
                incorrect: error.error.program,
              });
            }
            if (error.error.course_duration) {
              this.studentInfoForm.controls['course_duration'].setErrors({
                incorrect: error.error.course_duration,
              });
            }
            if (error.error.guardian_name) {
              this.studentInfoForm.controls['guardian_name'].setErrors({
                incorrect: error.error.guardian_name,
              });
            }
            if (error.error.guardian_email) {
              this.studentInfoForm.controls['guardian_email'].setErrors({
                incorrect: error.error.guardian_email,
              });
            }
            if (error.error.guardian_dialing_code) {
              this.studentInfoForm.controls['guardian_dialing_code'].setErrors({
                incorrect: error.error.guardian_dialing_code,
              });
            }
            if (error.error.guardian_contact_number) {
              this.studentInfoForm.controls['guardian_contact_number'].setErrors({
                incorrect: error.error.guardian_contact_number,
              });
            }
            if (error.error.guardian_relationship) {
              this.studentInfoForm.controls['guardian_relationship'].setErrors({
                incorrect: error.error.guardian_relationship,
              });
            }
            if (error.error.address_line_1) {
              this.studentInfoForm.controls['address_line_1'].setErrors({
                incorrect: error.error.address_line_1,
              });
            }
            if (error.error.address_line_2) {
              this.studentInfoForm.controls['address_line_2'].setErrors({
                incorrect: error.error.address_line_2,
              });
            }
            if (error.error.city) {
              this.studentInfoForm.controls['city'].setErrors({
                incorrect: error.error.city,
              });
            }
            if (error.error.state) {
              this.studentInfoForm.controls['state'].setErrors({
                incorrect: error.error.state,
              });
            }
            if (error.error.country) {
              this.studentInfoForm.controls['country'].setErrors({
                incorrect: error.error.country,
              });
            }
            if (error.error.county) {
              this.studentInfoForm.controls['county'].setErrors({
                incorrect: error.error.county,
              });
            }
            if (error.error.zipcode) {
              this.studentInfoForm.controls['zipcode'].setErrors({
                incorrect: error.error.zipcode,
              });
            }
          }
        );
    }
  }
}
