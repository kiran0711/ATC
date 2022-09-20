import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/shared/service/api.service';
import { SharedService } from 'src/shared/service/shared.service';
import { ApiEndpoints } from 'src/shared/utils/api-url';
import { ConfirmedValidator } from 'src/shared/utils/confirmed.validator';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.css'],
})
export class SecurityComponent implements OnInit {
  changePasswordForm: FormGroup;
  updateEmailForm: FormGroup;
  updateMobileForm: FormGroup;
  otpForm: FormGroup;
  timeLeft: any;
  resendOtpBlock: boolean = false;
  timerX: any;
  maxResendOTP = 0;
  showOTPBlock = false;
  showEmailBlock = false;
  showMobileBlock = false;
  mobileVerified = false;
  emailVerified = false;
  totalTimeLeft: boolean = false;
  dialingCode = '';
  primaryEmail = '';
  primaryMobile = '';
  extraData = null;
  successMsg = false;
  pwdSuccessMsg = '';
  emailVerifyMailSuccess: boolean = false;
  emailVerificationMailMsg: string = '';
  otpSentSuccess: boolean = false;
  otpSentMessage: string = '';
  mobileUpdateSuccess: boolean = false;
  mobileUpdateSuccessMsg: string = '';
  mobileUpdateVerifyOtpfailed: boolean = false;
  mobileUpdateVerifyMsg: any;
  disableGetOtp: boolean = false;
  emailSuccess: boolean = false;
  emailSuccessMsg: string = "";
  emailErrorMsg: string = ""
  emailError: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private sharedService: SharedService
  ) {
    this.changePasswordForm = this.formBuilder.group(
      {
        old_password: ['', [Validators.required]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(12),
            Validators.maxLength(15),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{12,15}$/
            ),
          ],
        ],
        confirm_password: [
          '',
          [
            Validators.required,
            Validators.minLength(12),
            Validators.maxLength(15),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{12,15}$/
            ),
          ],
        ],
      },
      {
        validator: ConfirmedValidator('password', 'confirm_password'),
      }
    );

    this.updateEmailForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      confirm_email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    this.updateMobileForm = this.formBuilder.group({
      dialing_code: ['+01', [Validators.required]],
      new_contact_number: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    this.otpForm = this.formBuilder.group({
      otp1: ['', Validators.required],
      otp2: ['', Validators.required],
      otp3: ['', Validators.required],
      otp4: ['', Validators.required],
      otp5: ['', Validators.required],
      otp6: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.showEmailBlock = false;
    this.showMobileBlock = false;
    this.setFormValues();
  }

  get changePasswordFormControl() {
    return this.changePasswordForm.controls;
  }

  get updateMobileFormControl() {
    return this.updateMobileForm.controls;
  }

  get updateEmailFormControl() {
    return this.updateEmailForm.controls;
  }

  showBlock() {
    this.showEmailBlock = true;
  }

  hideEmailBlock() {
    this.showEmailBlock = false;
  }

  showBlockMobile() {
    this.showMobileBlock = true;
  }

  hideBlockMobile() {
    this.showMobileBlock = false;
  }

  setFormValues() {
    this.apiService
      .get(environment.baseURL + ApiEndpoints.GET_PROFILE_DETAIL)
      .subscribe((data: any) => {
        console.log('profiel adta', data);
        data.data.email_verified === '0'
          ? (this.emailVerified = false)
          : (this.emailVerified = true);
        data.data.mobile_verified === '0'
          ? (this.mobileVerified = false)
          : (this.mobileVerified = true);

        this.dialingCode = data.data.dialing_code;
        this.updateMobileForm.get('dialing_code')?.setValue(this.dialingCode);
        console.log('profiel adta', data);
        this.primaryEmail = data.data.email;
        this.primaryMobile = data.data.mobile;
      });
  }

  changePassword() {
    let reqBody = {
      old_password: this.changePasswordForm.value.old_password,
      password: this.changePasswordForm.value.password,
      confirm_password: this.changePasswordForm.value.confirm_password,
    };
    this.apiService
      .post(environment.baseURL + ApiEndpoints.CHANGE_PASSWORD, reqBody)
      .subscribe(
        (data: any) => {
          this.pwdSuccessMsg = data.message;
          this.successMsg = true;
          this.resetPasswordForm();
        },
        (error) => {
          if (error.error.old_password) {
            this.changePasswordForm.controls['old_password'].setErrors({
              incorrect: error.error.old_password,
            });
          }
          if (error.error.password) {
            this.changePasswordForm.controls['password'].setErrors({
              incorrect: error.error.password,
            });
          }
          if (error.error.confirm_password) {
            this.changePasswordForm.controls['confirm_password'].setErrors({
              incorrect: error.error.confirm_password,
            });
          }
        }
      );
  }

  resetPasswordForm() {
    this.changePasswordForm = this.formBuilder.group({
      old_password: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirm_password: ['', [Validators.required]],
    });
  }

  changeEmail() {
    console.log(this.updateEmailForm.value);
    let reqBody = {
      email: this.updateEmailForm.value.email,
      confirm_email: this.updateEmailForm.value.confirm_email,
      password: this.updateEmailForm.value.password,
    };
    this.emailSuccess = false;
    this.emailError = false;
    this.apiService
      .post(environment.baseURL + ApiEndpoints.UPDATE_EMAIL, reqBody)
      .subscribe((data: any) => {
        console.log('dataaa', data);
        this.emailSuccess = true;
        this.emailSuccessMsg = data.message;
        this.primaryEmail = data.data.email;
      },
      error => {
        if (error.error?.email) {
          this.updateEmailForm.controls.confirm_email.setErrors({incorrect:error.error.email});
        } else {
          this.emailErrorMsg = error.message;
          this.emailError = true;
        }
        console.log(error);
      });
  }

  otpLengthCheck(e: any) {
    if (e.target.value.length < 1) {
      setTimeout(() => {
        let elem = document.getElementById(
          (Number(e.target.id) + 1).toString()
        ) as HTMLElement;
        elem?.focus();
      }, 0);
      return true;
    } else {
      return false;
    }
  }
  verifyOtp() {
    if (this.otpForm.valid) {
      const otpVal =
        this.otpForm.value.otp1.toString() +
        this.otpForm.value.otp2.toString() +
        this.otpForm.value.otp3.toString() +
        this.otpForm.value.otp4.toString() +
        this.otpForm.value.otp5.toString() +
        this.otpForm.value.otp6.toString();
      let reqBody;
      reqBody = {
        otp: otpVal,
        extra_data: JSON.stringify(this.extraData),
      };

      this.apiService
        .post(environment.baseURL + ApiEndpoints.UPDATE_MOBILE_OTP, reqBody)
        .subscribe((data) => {
          this.maxResendOTP = 0;
          clearInterval(this.timerX);
          this.showOTPBlock = false;
          this.showMobileBlock = false;
          this.updateMobileForm.reset();
          this.setFormValues();
          this.mobileUpdateSuccess = true;
          this.mobileUpdateSuccessMsg = data.message;
        },
        error => {
          this.mobileUpdateVerifyOtpfailed = true;
          this.mobileUpdateVerifyMsg = error.message;
        });
    }
  }
  timer(minute: any) {
    let seconds: number = minute * 60;
    let textSec: any = '0';
    let statSec: number = 60;

    const prefix = minute < 10 ? '0' : '';
    this.totalTimeLeft = true;

    this.timerX = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = '0' + statSec;
      } else textSec = statSec;

      this.timeLeft = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) {
        if (this.maxResendOTP === 2) {
          this.maxResendOTP = 0;
        } else {
          this.resendOtpBlock = true;
          this.totalTimeLeft = false;
        }
        clearInterval(this.timerX);
      }
    }, 1000);
  }

  resendOTP() {
    let reqBody = {
      dialing_code: this.updateMobileForm.value.dialing_code,
      mobile: this.updateMobileForm.value.new_contact_number,
      user_id: this.sharedService.getUserDetails().user_id
    };

    this.apiService
      .post(environment.baseURL + ApiEndpoints.UPDATE_MOBILE_OTP_RESEND,  {extra_data:JSON.stringify(reqBody)})
      .subscribe((data: any) => {
        this.maxResendOTP++;
        this.resendOtpBlock = false;
        this.otpSentMessage = data.message;
        clearInterval(this.timerX);
        this.totalTimeLeft = true;
        this.timer(3);
      });
  }

  getOTP() {
    console.log(this.updateMobileForm.value);
    let reqBody = {
      dialing_code: this.updateMobileForm.value.dialing_code,
      mobile: this.updateMobileForm.value.new_contact_number,
      password: this.updateMobileForm.value.password,
    };
    this.apiService
      .post(environment.baseURL + ApiEndpoints.UPDATE_MOBILE, reqBody)
      .subscribe(
        (data: any) => {
          console.log('dataaa', data);
          this.extraData = data.data;
          this.otpSentSuccess = true;
          this.otpSentMessage = data.message;
          this.showOTPBlock = true;
          this.disableGetOtp = true;
          this.timer(1);
          this.resendOtpBlock = false;
        },
        (error: any) => {
          if (error.error.mobile) {
            this.updateMobileForm.controls['new_contact_number'].setErrors({
              incorrect: error.error.mobile,
            });
          }
          if (error.error.password) {
            this.updateMobileForm.controls['password'].setErrors({
              incorrect: error.error.password,
            });
          }
        }
      );
  }

  sendEmailVerificationMail() {
    let reqBody = {
      user_id: this.sharedService.getUserDetails().user_id,
    };
    this.apiService
      .post(environment.baseURL + ApiEndpoints.VERIFY_EMAIL, reqBody)
      .subscribe((data: any) => {
        console.log('dataaa', data);
        this.emailVerificationMailMsg = data.message;
        this.emailVerifyMailSuccess = true;
      });
  }
}
