import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { Form, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmedValidator } from '../../utils/confirmed.validator';
import * as moment from 'moment';
import { CheckUserName } from 'src/shared/utils/username.validator';
import { ApiService } from 'src/shared/service/api.service';
import { environment } from 'src/environments/environment';
import { ApiEndpoints } from 'src/shared/utils/api-url';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as CONSTANTS from 'src/app/app.constants';
import { isPlatformBrowser} from '@angular/common';
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialAuthService,
  SocialUser,
} from 'angularx-social-login';
import { SharedService } from 'src/shared/service/shared.service';
import jwt_decode from 'jwt-decode';
import { TranslatorService } from 'src/shared/service/translator.service';
import { Idle } from 'idlejs';
import { BnNgIdleService } from 'bn-ng-idle';
import { Subscription } from 'rxjs';
// import * as from 'jquery';
declare var $: any

@Component({
  selector: 'app-mobile-login',
  templateUrl: './mobile-login.component.html',
  styleUrls: ['./mobile-login.component.css']
})
export class MobileLoginComponent implements OnInit {
  domain:any = CONSTANTS.domain;
  loginContentFlag: boolean = true;
  forgotPasswordFlag: boolean = false;
  resetLinkFlag: boolean = false;
  registerFlag: boolean = false;
  registerAsContentFlag: boolean = false;
  registerAsGuestContentFlag: boolean = false;
  registerContentFlag: boolean = false;
  loginCongratulationsFlag: boolean = false;
  chooseHostOrGuestFlag: boolean = false;
  alreadyRegistered: boolean = false;
  registerForm: FormGroup;
  loginForm: FormGroup;
  otpForm: FormGroup;
  userTypeForm: FormGroup;
  guestTypeForm: FormGroup;
  forgotPasswordForm: FormGroup;
  resetForm: FormGroup;
  notAcceptingPolicy: boolean = true;
  welcomeUserName = '';
  yearsago = new Date(
    moment(new Date()).subtract(18, 'years').format('MM-DD-YYYY')
  );
  timeLeft: any;
  totalTimeLeft: boolean = false;
  resendOtpBlock: boolean = false;
  fromRegisterPage: boolean = false;
  extraData = null;
  extraDataRegister = null;
  extraDataResetPassword = null;
  fieldTextType = false;
  timerX: any;
  maxResendOTP = 0;
  loginFlag: boolean = true;
  token: string | undefined;
  countryCodes = ['+1', '+91', '+60'];
  defaultCoutryCode: string = '+1';
  otpSentMsg = '';
  becomeHostBtn: boolean = false;
  profileOptions: boolean = false;
  // wasEnglish: boolean = true;
  userDisplayName: string = '';
  socialUser: SocialUser = {
    provider: '',
    id: '',
    email: '',
    name: '',
    photoUrl: '',
    firstName: '',
    lastName: '',
    authToken: '',
    idToken: '',
    authorizationCode: '',
    response: '',
  };
  guestAndHost = false;
  headerSearchbar = false;
  languages = CONSTANTS.LANGUAGES;
  selectedLanguage?: any = CONSTANTS.LANGUAGES[0];
  congratulationsMsg: string = '';
  loginErrorMsg = false;
  generalErrorMsgFlag = false;
  generalErrorMsg = '';
  profilePic = '';
  changeTypeMethordChoosen: any
  @ViewChild('profile_button') profileButton: ElementRef;
  @ViewChild('profile_button2') profileButton2: ElementRef;
  loginValue: boolean;
  subscription: Subscription;
  captchaErrorMsg: string;
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.stickHeader();
  }

  otpMsgSuccess: boolean = true;
 
  constructor(@Inject(PLATFORM_ID) private platformId : any,
    public translator: TranslatorService,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private toastr: ToastrService,
    private router: Router,
    private socialAuthService: SocialAuthService,
    public sharedService: SharedService,
    private route: ActivatedRoute,
    private bnIdle: BnNgIdleService
  ) {
    this.sharedService.loginHeader.subscribe((val) => {
      this.loginFlag = val;
      if (localStorage.getItem('userdata')) {
        let userStr = localStorage.getItem('userdata') || '{}';
        let user = JSON.parse(userStr);
        this.sharedService.userDisplayNameValue =
          user.firstname + ' ' + (user.lastname || '');

        this.sharedService.userProfilePictureValue = user.profile_picture;
      }
    });
    this.sharedService.userDisplayName.subscribe((val) => {
      this.userDisplayName = val;
    });
    this.sharedService.userProfilePicture.subscribe((val) => {
      this.profilePic = val;
    });
    this.token = undefined;
    this.registerForm = this.formBuilder.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        phoneNumber: [
          '',
          [
            Validators.required,
            Validators.minLength(9),
            Validators.maxLength(11),
            Validators.pattern(/^[1-9]?\d{10}$$/),
          ],
        ],
        emailAddress: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            ),
          ],
        ],
        dialingCode: ['+1', Validators.required],
        dob: ['', Validators.required],
        gender: ['', Validators.required],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(12),
            Validators.maxLength(16),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{12,15}$/
            ),
          ],
        ],
        confirmPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(12),
            Validators.maxLength(16),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{12,15}$/
            ),
          ],
        ],
        acceptAndAgree: [false, Validators.requiredTrue],
        referedBy: ['']
      },
      {
        validator: ConfirmedValidator('password', 'confirmPassword'),
      }
    );

    this.loginForm = this.formBuilder.group(
      {
        username: ['', [Validators.required]],
        loginPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(16),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,16}$/
            ),
          ],
        ],
        captcha: [null, Validators.required],
      },
      {
        // validator: CheckUserName('username'),
      }
    );

    this.otpForm = this.formBuilder.group({
      otp1: ['', Validators.required],
      otp2: ['', Validators.required],
      otp3: ['', Validators.required],
      otp4: ['', Validators.required],
      otp5: ['', Validators.required],
      otp6: ['', Validators.required],
    });

    this.userTypeForm = this.formBuilder.group({
      userType: ['', Validators.required],
    });

    this.guestTypeForm = this.formBuilder.group({
      guestType: ['', Validators.required],
    });

    this.forgotPasswordForm = this.formBuilder.group(
      {
        forgotPasswordEmail: ['', [Validators.required]],
      },
      {
        validator: CheckUserName('forgotPasswordEmail'),
      }
    );

    this.resetForm = this.formBuilder.group(
      {
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(16),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,16}$/
            ),
          ],
        ],
        confirmNewPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(16),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,16}$/
            ),
          ],
        ],
        otp1: ['', Validators.required],
        otp2: ['', Validators.required],
        otp3: ['', Validators.required],
        otp4: ['', Validators.required],
        otp5: ['', Validators.required],
        otp6: ['', Validators.required],
      },
      {
        validator: ConfirmedValidator('newPassword', 'confirmNewPassword'),
      }
    );

    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      let socialData = {
        id: this.socialUser.id,
        firstname: this.socialUser.firstName,
        lastname: this.socialUser.lastName,
        email: this.socialUser.email ? this.socialUser.email : null,
      };
      let reqBody = {
        social: JSON.stringify(socialData),
      };
      let url = '';
      if (this.socialUser.provider === 'GOOGLE') {
        url = ApiEndpoints.GOOGLE_LOGIN;
      } else if (this.socialUser.provider === 'FACEBOOK') {
        url = ApiEndpoints.FACEBOOK_LOGIN;
      }
      this.apiService
        .post(environment.baseURL + url, reqBody)
        .subscribe((data: any) => {
          console.log('dataaa', data);
          this.loadScript();
          localStorage.setItem('authToken', data.data.access_token);
          localStorage.setItem('userdata', JSON.stringify(data.data.user_data));
          this.sharedService.loginHeaderValue = false;
          if (
            data.data.user_data.user_type === CONSTANTS.USER_TYPE.GUEST_AND_HOST
          ) {
            this.loginContentFlag = !this.loginContentFlag;
            this.chooseHostOrGuestFlag = !this.chooseHostOrGuestFlag;
            this.welcomeUserName = data.data.user_data.firstname;
          } else if (
            data.data.user_data.user_type === CONSTANTS.USER_TYPE.GUEST
          ) {
            document.getElementById('closeModal')?.click();
            this.becomeHostBtn = true;
            localStorage.setItem(CONSTANTS.ROLE, 'guest');
            this.router.navigateByUrl('/guest');
          } else if (
            data.data.user_data.user_type === CONSTANTS.USER_TYPE.HOST
          ) {
            document.getElementById('closeModal')?.click();
            this.becomeHostBtn = false;
            localStorage.setItem(CONSTANTS.ROLE, 'host');
            this.router.navigateByUrl('/host');
          }
        });
    });

    if (localStorage.getItem(CONSTANTS.ROLE) == 'guest') {
      this.becomeHostBtn = true
    } else {
      this.becomeHostBtn = false
    }

    this.route.queryParams.subscribe(
      (params: Params) => {
        // console.log(this.route.snapshot.params);
        let path = this.router.url.split('?')[0]
        if (params['referal-code'] && !(this.user && this.user.user_id) && path == '/') {
          this.registerForm.patchValue({
            referedBy: params['referal-code']
          });
          this.registerPopup(1, 2)

        }
        // subscription.unsubscribe()
      });
  }

  get role() {
    let r = localStorage.getItem(CONSTANTS.ROLE);
    r = r || '';
    return r;
  }

  private loadScript() {
    let appleCdn = document.createElement('script');
    appleCdn.type = 'text/javascript';
    appleCdn.async = true;
    appleCdn.src =
      'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
    document.body.appendChild(appleCdn);

    let appleJsScript = document.createElement('script');
    appleJsScript.type = 'text/javascript';
    appleJsScript.async = true;
    if (environment.production) {
      appleJsScript.src = '../../assets/js/appleAuth-ca.js';
    } else {
      appleJsScript.src = '../../assets/js/appleAuth-staging.js';
    }

    document.body.appendChild(appleJsScript);

    let translatorJsScript = document.createElement('script');
    translatorJsScript.type = 'text/javascript';
    translatorJsScript.async = true;
    translatorJsScript.src = '../../assets/js/googleTranslator.js';
    document.body.appendChild(translatorJsScript);

    let googleTranslatorCdn = document.createElement('script');
    googleTranslatorCdn.type = 'text/javascript';
    googleTranslatorCdn.async = true;
    googleTranslatorCdn.src = '../../assets/js/googleTranslatorCDN.js';
    document.body.appendChild(googleTranslatorCdn);
  }


  ngOnInit(): void {
   //check fragment
   this.subscription = this.route.fragment.subscribe((fragment: any) => {
    switch (fragment) {
      case 'login':
        this.loginPopup()
        break;
    
      default:
        break;
    }
  });
  this.registerForm.valueChanges.subscribe((val) => {
    val.acceptAndAgree && this.registerForm.valid
      ? (this.notAcceptingPolicy = false)
      : (this.notAcceptingPolicy = true);
  });
  if (localStorage.getItem('userdata')) {
    this.loginFlag = false;
    let userStr = localStorage.getItem('userdata') || '{}';
    let user = JSON.parse(userStr);
    this.sharedService.userDisplayNameValue ==
      user.firstname + ' ' + (user.lastname || '');
    this.sharedService.userProfilePictureValue = user.profile_picture;
  }
  let language = this.readCookie('googtrans')
  // console.log(language)
  if (language == 'en') {
    language = 'en'
    // this.delete_cookie('googtrans')
    $('#\\:1\\.container').contents().find('#\\:1\\.restore').click();

  }
  if (language)
    this.getLangCode({ target: { value: language } })
  this.sharedService.openRegisterPopup.subscribe((msg: any) => {
    console.log(msg)
    this.registerPopup(msg.userType, msg.guestType)
  })

  this.sharedService.openLoginPopup.subscribe((msg: any) => {
    console.log(msg)
    this.loginPopup()
  })

  this.sharedService.changeRegTypeOrRegister.subscribe((msg: any) => {
    console.log(msg)
    this.changeUserType(null)
  })

  this.bnIdle.startWatching(60 * CONSTANTS.AUTO_LOGOUT_MINUTES).subscribe((isTimedOut: boolean) => {
    if (this.loginValue && isTimedOut) {
      console.log('session expired', isTimedOut, Date());
      this.logout()
    }
  });
}

ngOnChanges(changes: SimpleChanges): void {
  console.log(changes);
}

// delete_cookie(name:any) {
//   // document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

// }

readCookie(name: any) {
  var c = document.cookie.split('; ');
  var cookies: any = {}, i, C;

  for (i = c.length - 1; i >= 0; i--) {
    C = c[i].split('=');
    cookies[C[0]] = C[1];
  }
  if (!cookies[name]) {
    return null
  }
  return cookies[name].replace("/auto/", "").replace('/en/', "");
}

ngAfterViewInit() {
  this.loadScript();
  //Listen for authorization success
  document.addEventListener('AppleIDSignInOnSuccess', (data: any) => {
    console.log('AppleIDSignInOnSuccess', data);
    console.log(data.detail.authorization.id_token);
    let token = data.detail.authorization.id_token;
    let decoded: any = jwt_decode(token);
    console.log(decoded);
    console.log(decoded.email);
    //handle successful response
    let socialData = {
      id: null,
      firstname: null,
      lastname: null,
      email: decoded.email,
    };
    let reqBody = {
      social: JSON.stringify(socialData),
    };
    this.apiService
      .post(environment.baseURL + ApiEndpoints.APPLE_LOGIN, reqBody)
      .subscribe((data: any) => {
        console.log('dataaa', data);
        localStorage.setItem('authToken', data.data.access_token);
        localStorage.setItem('userdata', JSON.stringify(data.data.user_data));
        this.sharedService.loginHeaderValue = false;
        if (
          data.data.user_data.user_type === CONSTANTS.USER_TYPE.GUEST_AND_HOST
        ) {
          this.loginContentFlag = !this.loginContentFlag;
          this.chooseHostOrGuestFlag = !this.chooseHostOrGuestFlag;
          this.welcomeUserName = data.data.user_data.firstname;
        } else if (
          data.data.user_data.user_type === CONSTANTS.USER_TYPE.GUEST
        ) {
          document.getElementById('closeModal')?.click();
          this.becomeHostBtn = true;
          localStorage.setItem(CONSTANTS.ROLE, 'guest');
          this.router.navigateByUrl('/guest');
        } else if (
          data.data.user_data.user_type === CONSTANTS.USER_TYPE.HOST
        ) {
          document.getElementById('closeModal')?.click();
          this.becomeHostBtn = false;
          localStorage.setItem(CONSTANTS.ROLE, 'host');
          this.router.navigateByUrl('/host');
        }
      });
  });

  //Listen for authorization failures
  document.addEventListener('AppleIDSignInOnFailure', (error: any) => {
    console.log(error);
    // this.toastr.error(error.detail.error);
    //handle error.
  });

  this.sharedService.userPerspective.subscribe((val) => {
    if (val !== 'null') {
      this.guestAndHost = true;
    }
  });
}

appleSigninClick() {
  const appleBtn = document.getElementById('appleid-signin') as HTMLElement;
  appleBtn.click();
}

get registrationForm() {
  return this.registerForm.controls;
}

get resetPasswordControlForm() {
  return this.resetForm.controls;
}

get loginControlForm() {
  return this.loginForm.controls;
}

get userTypeControlForm() {
  return this.userTypeForm.controls;
}

get otpControlForm() {
  return this.otpForm.controls;
}

get forgotPasswordControlForm() {
  return this.forgotPasswordForm.controls;
}

forgotPassword() {
  console.log('forgot pwd');
  this.forgotPasswordFlag = !this.forgotPasswordFlag;
  this.loginContentFlag = !this.loginContentFlag;
}

backToForgotPassword() {
  this.forgotPasswordFlag = !this.forgotPasswordFlag;
  this.resetLinkFlag = !this.resetLinkFlag;
  this.forgotPasswordForm.reset();
}

resetLink() {
  if (this.forgotPasswordForm.valid) {
    let reqBody = {
      email_or_mobile: this.forgotPasswordForm.value.forgotPasswordEmail,
    };
    this.apiService
      .post(environment.baseURL + ApiEndpoints.FORGOT_PASSWORD, reqBody)
      .subscribe((data: any) => {
        this.extraDataResetPassword = data.data;
        this.timer(5);
        this.forgotPasswordFlag = !this.forgotPasswordFlag;
        this.resetLinkFlag = !this.resetLinkFlag;
        this.resetForm.reset();
      });
  }
}

resetPassword() {
  if (this.resetForm.valid) {
    const otpVal =
      this.resetForm.value.otp1.toString() +
      this.resetForm.value.otp2.toString() +
      this.resetForm.value.otp3.toString() +
      this.resetForm.value.otp4.toString() +
      this.resetForm.value.otp5.toString() +
      this.resetForm.value.otp6.toString();
    let reqBody = {
      password: this.resetForm.value.newPassword,
      confirm_password: this.resetForm.value.newPassword,
      otp: otpVal,
      extra_data: JSON.stringify(this.extraDataResetPassword),
    };
    this.apiService
      .post(environment.baseURL + ApiEndpoints.RESET_PASSWORD, reqBody)
      .subscribe((data: any) => {
        document.getElementById('closeModal')?.click();
        this.toastr.success(data.message);
      });
  }
}

toggleFieldTextType() {
  this.fieldTextType = !this.fieldTextType;
}

modalClick() {
  this.loginContentFlag = true;
  this.forgotPasswordFlag = false;
  this.resetLinkFlag = false;
  this.registerFlag = false;
  this.registerAsContentFlag = false;
  this.registerAsGuestContentFlag = false;
  this.registerContentFlag = false;
  this.loginCongratulationsFlag = false;
  this.chooseHostOrGuestFlag = false;
  this.alreadyRegistered = false;
  clearInterval(this.timerX);
  this.loginForm.reset();
  this.registerForm.reset();
  this.otpForm.reset();
  this.resetForm.reset();
  this.forgotPasswordForm.reset();
}

backTologin() {
  this.loginContentFlag = !this.loginContentFlag;
  this.registerContentFlag = !this.registerContentFlag;
  this.loginForm.reset();
}

backTologinorRegister() {
  if (this.fromRegisterPage) {
    this.registerContentFlag = !this.registerContentFlag;
    this.registerForm.reset();
  } else {
    this.loginContentFlag = !this.loginContentFlag;
    this.loginForm.reset();
  }
  this.resendOtpBlock = false;
  clearInterval(this.timerX);
  this.registerFlag = !this.registerFlag;
}

resolved(captchaResponse: string) {
  if (captchaResponse) {
    this.loginForm.patchValue({
      captcha: captchaResponse,
    });
  } else {
    this.loginForm.patchValue({
      captcha: null,
    });
  }
}

errored(err: any) {
  console.warn(`reCAPTCHA error encountered`, err);
}

loginWithGoogle() {
  this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
}

loginWithFacebook() {
  this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
}

login() {
  if(!this.token){
    this.captchaErrorMsg = 'Captcha is required.'
    return
  }
  this.fromRegisterPage = false;
  if (true) {
    let reqBody = {
      email_or_mobile: this.loginForm.value.username,
      password: this.loginForm.value.loginPassword,
      device_type: 'web',
    };
    this.apiService
      .post(environment.baseURL + ApiEndpoints.LOGIN, reqBody)
      .subscribe(
        (data: any) => {
          this.timer(3);
          this.extraData = data.data;
          this.otpForm.reset();
          this.otpSentMsg = data.message;
          this.otpMsgSuccess = true;
          this.otpForm.reset();
          this.maxResendOTP = 0;
          this.loginContentFlag = !this.loginContentFlag;
          this.registerFlag = !this.registerFlag;
        },
        (error) => {
          console.log(error.message);
          if (error.error && error.error.password) {
            this.loginForm.controls['loginPassword'].setErrors({
              incorrect: error.error.password,
            });
            this.loginErrorMsg = false;
            this.generalErrorMsgFlag = false;
          } else if (error.message.indexOf('exist') !== -1) {
            this.loginErrorMsg = true;
            this.generalErrorMsgFlag = false;
          } else {
            this.loginErrorMsg = false;
            this.generalErrorMsgFlag = true;
            this.generalErrorMsg = error.message;
          }
        }
      );
  }


}

registerAsContent() {
  this.userTypeForm.reset();
  this.guestTypeForm.reset();
  this.loginContentFlag = !this.loginContentFlag;
  this.registerAsContentFlag = !this.registerAsContentFlag;
}

continueRegisterStep() {
  console.log(typeof this.userTypeForm.value.userType);
  if (this.userTypeForm.value.userType == '2') {
    this.registerContentFlag = !this.registerContentFlag;
    this.registerAsContentFlag = !this.registerAsContentFlag;
  } else {
    this.registerAsContentFlag = !this.registerAsContentFlag;
    this.registerAsGuestContentFlag = !this.registerAsGuestContentFlag;
  }
}

backFromGuestType() {
  this.guestTypeForm.reset();
  this.registerAsGuestContentFlag = !this.registerAsGuestContentFlag;
  this.registerAsContentFlag = !this.registerAsContentFlag;
}

backFromRegisterContent() {
  console.log(this.guestTypeForm.value.guestType);
  if (this.guestTypeForm.value.guestType) {
    this.registerContentFlag = !this.registerContentFlag;
    this.registerAsGuestContentFlag = !this.registerAsGuestContentFlag;
  } else {
    this.registerAsContentFlag = !this.registerAsContentFlag;
    this.registerContentFlag = !this.registerContentFlag;
  }
}

continueRegisterSection() {
  this.registerAsGuestContentFlag = !this.registerAsGuestContentFlag;
  this.registerContentFlag = !this.registerContentFlag;
}

submitRegistration() {
  console.log(
    'this.guestTypeForm.value.guestType',
    this.guestTypeForm.value.guestType
  );
  if (this.registerForm.valid) {
    let reqBody = {
      email: this.registerForm.value.emailAddress,
      user_type: this.userTypeForm.value.userType,
      firstname: this.registerForm.value.firstName,
      lastname: this.registerForm.value.lastName,
      dialing_code: this.registerForm.value.dialingCode,
      confirm_password: this.registerForm.value.confirmPassword,
      mobile: this.registerForm.value.phoneNumber,
      password: this.registerForm.value.password,
      dob: moment(new Date(this.registerForm.value.dob)).format(
        CONSTANTS.DOB_API_FORMAT
      ),
      gender: this.registerForm.value.gender,
      device_type: 'web',
      user_profile_type: this.guestTypeForm.value.guestType
        ? this.guestTypeForm.value.guestType
        : 0,
      terms: this.registerForm.value.acceptAndAgree ? 1 : 0,
      referral_code: this.registerForm.value.referedBy
    };
    this.apiService
      .post(environment.baseURL + ApiEndpoints.REGISTER, reqBody)
      .subscribe(
        (data: any) => {
          this.registerContentFlag = !this.registerContentFlag;
          this.fromRegisterPage = true;
          if (data.data.account_exist === 1) {
            this.alreadyRegistered = !this.alreadyRegistered;
          } else {
            this.timer(3);
            this.maxResendOTP = 0;
            this.otpSentMsg = data.message;
            this.otpMsgSuccess = true;
            this.otpForm.reset();
            this.registerFlag = !this.registerFlag;
            this.extraDataRegister = data.data;
          }
        },
        (error) => {
          if (error.error.email) {
            this.registerForm.controls['emailAddress'].setErrors({
              incorrect: error.error.email,
            });
          }
          if (error.error.password) {
            this.registerForm.controls['password'].setErrors({
              incorrect: error.error.password,
            });
          }
          if (error.error.mobile) {
            this.registerForm.controls['phoneNumber'].setErrors({
              incorrect: error.error.mobile,
            });
          }
          if (error.error.gender) {
            this.registerForm.controls['gender'].setErrors({
              incorrect: error.error.gender,
            });
          }
        }
      );
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
        this.backTologinorRegister();
        this.maxResendOTP = 0;
      } else {
        this.resendOtpBlock = true;
        this.totalTimeLeft = false;
      }
      clearInterval(this.timerX);
    }
  }, 1000);
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
    let url = '';
    if (this.fromRegisterPage) {
      url = ApiEndpoints.REGISTER_OTP;
      reqBody = {
        otp: otpVal,
        extra_data: JSON.stringify(this.extraDataRegister),
      };
    } else {
      url = ApiEndpoints.LOGIN_OTP;
      reqBody = {
        otp: otpVal,
        extra_data: JSON.stringify(this.extraData),
      };
    }
    this.apiService
      .post(environment.baseURL + url, reqBody)
      .subscribe((data) => {
        this.loadScript();
        this.maxResendOTP = 0;
        clearInterval(this.timerX);
        localStorage.setItem(CONSTANTS.AUTH_TOKEN, data.data.access_token);
        this.loginValue = true;
        this.registerFlag = !this.registerFlag;
        console.log('data', data);
        this.sharedService.loginHeaderValue = false;
        localStorage.setItem(
          CONSTANTS.USER_DATA,
          JSON.stringify(data.data.user_data)
        );
        let user = data.data.user_data;
        this.sharedService.userDisplayNameValue =
          user.firstname + ' ' + (user.lastname || '');
        this.sharedService.userProfilePictureValue = user.profile_picture;
        if (this.fromRegisterPage) {
          this.loginCongratulationsFlag = !this.loginCongratulationsFlag;
          this.congratulationsMsg = data.message;
          if (user.user_type === CONSTANTS.USER_TYPE.GUEST) {
            this.router.navigateByUrl('/guest/dashboard');
            this.becomeHostBtn = true;
            localStorage.setItem(CONSTANTS.ROLE, 'guest');
          } else if (user.user_type === CONSTANTS.USER_TYPE.HOST) {
            this.router.navigateByUrl('/host');
            this.becomeHostBtn = false;
            localStorage.setItem(CONSTANTS.ROLE, 'host');
          } else {
            this.router.navigateByUrl('/guest');
            this.becomeHostBtn = true;
            localStorage.setItem(CONSTANTS.ROLE, 'guest');
          }
        } else {
          if (user.user_type === CONSTANTS.USER_TYPE.GUEST_AND_HOST) {
            this.chooseHostOrGuestFlag = !this.chooseHostOrGuestFlag;
            this.welcomeUserName = data.data.user_data.firstname;
            this.becomeHostBtn = true;
            localStorage.setItem(CONSTANTS.ROLE, 'guest');
          } else if (user.user_type === CONSTANTS.USER_TYPE.GUEST) {

            if (user.user_profile_type === CONSTANTS.USER_PROFILE.STUDENT) {
              this.router.navigateByUrl('/guest/home/student');
            } else if (
              user.user_profile_type === CONSTANTS.USER_PROFILE.PROFESSIONAL
            ) {
              this.router.navigateByUrl('/guest/home/professional');
            } else if (
              user.user_profile_type === CONSTANTS.USER_PROFILE.TRAVELLER
            ) {
              this.router.navigateByUrl('/guest/home/traveller');
            } else {
              this.router.navigateByUrl('/guest/dashboard');
            }
            this.becomeHostBtn = true;
            localStorage.setItem(CONSTANTS.ROLE, 'guest');
            document.getElementById('closeModal')?.click();
          } else if (user.user_type === CONSTANTS.USER_TYPE.HOST) {
            this.router.navigateByUrl('/host');
            this.becomeHostBtn = false;
            localStorage.setItem(CONSTANTS.ROLE, 'host');
            document.getElementById('closeModal')?.click();
          }
        }
      },
        (error) => {
          this.otpSentMsg = error.message;
          this.otpMsgSuccess = false;
          this.otpForm.reset();
        });
  }
}

resendOTP() {
  let url, reqBody;
  if (this.fromRegisterPage) {
    url = ApiEndpoints.RESEND_OTP_REGISTER;
    reqBody = {
      extra_data: JSON.stringify(this.extraDataRegister),
    };
  } else {
    url = ApiEndpoints.RESEND_OTP_LOGIN;
    reqBody = {
      extra_data: JSON.stringify(this.extraData),
    };
  }

  this.apiService
    .post(environment.baseURL + url, reqBody)
    .subscribe((data: any) => {
      this.maxResendOTP++;
      this.otpSentMsg = data.message;
      this.otpMsgSuccess = true;
      this.resendOtpBlock = false;
      this.otpForm.reset();
      clearInterval(this.timerX);
      this.totalTimeLeft = true;
      this.timer(3);
    });
}

resendOTPResetPassword() {
  let reqBody;
  reqBody = {
    extra_data: JSON.stringify(this.extraDataResetPassword),
  };

  this.apiService
    .post(
      environment.baseURL + ApiEndpoints.RESEND_OTP_RESET_PASSWORD,
      reqBody
    )
    .subscribe((data: any) => {
      this.maxResendOTP++;
      this.toastr.success(data.message);
      this.resendOtpBlock = false;
      clearInterval(this.timerX);
      this.totalTimeLeft = true;
      this.timer(5);
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

guestOrHost(val: number) {
  if (val === CONSTANTS.USER_TYPE.GUEST) {
    this.becomeHostBtn = true;
    this.sharedService.userPerspectiveValue = CONSTANTS.GUEST;
    localStorage.setItem('userPerspective', CONSTANTS.GUEST);
    localStorage.setItem(CONSTANTS.ROLE, 'guest');
    this.router.navigateByUrl('/guest');
  } else if (val === CONSTANTS.USER_TYPE.HOST) {
    this.sharedService.userPerspectiveValue = CONSTANTS.HOST;
    localStorage.setItem('userPerspective', CONSTANTS.HOST);
    localStorage.setItem(CONSTANTS.ROLE, 'host');
    this.becomeHostBtn = false;
    this.router.navigateByUrl('/host');
  }
  document.getElementById('closeModal')?.click();
  this.sharedService.loginHeaderValue = false;
}

continueToLogin() {
  this.loginContentFlag = !this.loginContentFlag;
  this.loginForm.patchValue({
    username: this.registerForm.value.emailAddress,
  });
  this.registerForm.reset();
  this.alreadyRegistered = !this.alreadyRegistered;
}

backToRegister() {
  this.alreadyRegistered = !this.alreadyRegistered;
  this.registerContentFlag = !this.registerContentFlag;
}

goToDashboard() {
  document.getElementById('closeModal')?.click();
}

navigateDashboard() {
  if (localStorage.getItem('userdata')) {
    let userStr = localStorage.getItem('userdata') || '{}';
    let user = JSON.parse(userStr);
    if (user.user_type === 1) {
      localStorage.setItem(CONSTANTS.ROLE, "guest")
      this.router.navigateByUrl('/guest');
    } else if (user.user_type === 2) {
      localStorage.setItem(CONSTANTS.ROLE, "guest")
      this.router.navigateByUrl('/host');
    } else {
      let role = localStorage.getItem(CONSTANTS.ROLE)
      if (role == 'guest') {
        this.router.navigateByUrl('/guest');
      } else {
        this.router.navigateByUrl('/host');
      }

    }
  }
}

profileClick() {
  this.profileOptions = !this.profileOptions;
}

@HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent) {
  let element: HTMLElement = event.target as HTMLElement;
  if (this.profileButton && this.profileButton2 && !((this.profileButton.nativeElement as HTMLElement).contains(element) ||
    (this.profileButton2.nativeElement as HTMLElement).contains(element))) {
    this.profileOptions = false
  }

}

redirectToHome() {
  console.log('redirectToHome', this.sharedService.gettoken());
  if (this.sharedService.gettoken()) {
    if (localStorage.getItem('userdata')) {
      let userStr = localStorage.getItem('userdata') || '{}';
      let user = JSON.parse(userStr);
      if (user.user_type === CONSTANTS.USER_TYPE.GUEST) {
        if (user.user_profile_type === CONSTANTS.USER_PROFILE.STUDENT) {
          this.router.navigateByUrl('/guest/home/student');
        } else if (
          user.user_profile_type === CONSTANTS.USER_PROFILE.PROFESSIONAL
        ) {
          this.router.navigateByUrl('/guest/home/professional');
        } else if (
          user.user_profile_type === CONSTANTS.USER_PROFILE.TRAVELLER
        ) {
          this.router.navigateByUrl('/guest/home/traveller');
        }
      } else if (user.user_type === CONSTANTS.USER_TYPE.HOST) {
        this.router.navigateByUrl('/');
      } else {
        this.router.navigateByUrl('/');
      }
    }
  } else {
    this.router.navigateByUrl('/');
  }
}

logout() {
  this.apiService
    .post(environment.baseURL + ApiEndpoints.LOGOUT, null)
    .subscribe((data) => {
      this.clearData()
    }, (error: any) => {
      console.log(error);
      this.clearData()
    });
}

clearData() {
  this.router.navigateByUrl('/');
  localStorage.removeItem(CONSTANTS.ROLE);
  localStorage.removeItem('authToken');
  localStorage.removeItem('userdata');
  localStorage.removeItem('userPerspective');
  this.sharedService.loginHeaderValue = true;
  this.loginValue = false;
  this.loadScript();
}
// changeLanguage(e: any) {
//   this.selectedLanguage = this.languages.find(
//     (l) => l.code === e.target.value
//   );
//   console.log(this.selectedLanguage);
//   this.translator
//     .translateValue('hello', this.selectedLanguage.code)
//     .subscribe((x) => console.log(x.translatedText));
// }

getLangCode(e: any) {
  console.log(e.target.value);
  let language = e.target.value
  if (language == 'en') {
    language = 'en'
    // this.delete_cookie('googtrans')
    $('#\\:1\\.container').contents().find('#\\:1\\.restore').click();

  }
  // if (this.wasEnglish) {
  //   let select = document.querySelector(
  //     '#google_translate_element .goog-te-combo'
  //   ) as HTMLSelectElement;
  //   if (select) {
  //     select.value = e.target.value;
  //     select.dispatchEvent(new Event('change'));
  //   }
  // }

  if (language) {
    this.selectedLanguage = this.languages.find(
      (l) => l.code === language
    );

    console.log('this.selectedLanguage', this.selectedLanguage);
  }
  // if (e.target.value === 'en' || e.target.value === '') {
  //   this.wasEnglish = true;
  // } else {
  //   this.wasEnglish = false;
  // }
}

stickHeader() {
  // const navbar = document.getElementById('stick_bar') as HTMLElement;
  // const sticky = 100;
  // if (window.pageYOffset >= sticky) {
  //   navbar.className += ' sticky';
  // } else {
  //   navbar.classList.remove('sticky');
  //   this.headerSearchbar = false;
  // }
}

searchBarClick() {
  this.headerSearchbar = !this.headerSearchbar;
}

openUrl(url: any) {
  if(isPlatformBrowser(this.platformId)){
  window.open(window.location.href + url, '_blank');
}
}

get user() {
  let userStr = localStorage.getItem('userdata') || '{}';
  return JSON.parse(userStr);
}

changeUserType(type: any) {
  if (this.user.user_type == 3) {

    let redirectValue: any;
    let firstValue: any = this.router.url.split('/')[1]

    // //homepage
    // if (firstValue == '') {
    //   redirectValue = this.router.url
    // }
    // else if (firstValue == 'profile' || firstValue == 'booking') {
    //   redirectValue = this.router.url
    // }
    // // else if (firstValue == 'booking') {
    // //   redirectValue = location.href.substring(location.href.lastIndexOf('/') + 1);
    // // }
    // else{
    //    redirectValue = type == 'guest' ? 'host' : 'guest';
    // }

    if (type == 'guest') {
      this.becomeHostBtn = true;
      localStorage.setItem(CONSTANTS.ROLE, 'guest');

      if (firstValue == 'host') {
        this.router.navigateByUrl('/guest');
      }
      else {
        window.location.reload();
        //this.router.navigateByUrl(this.router.url,{replaceUrl:true});
        // this.router.navigate(['/guest'], { relativeTo: this.route, queryParams: { 'redirect': redirectValue } });
      }

    }
    else {
      this.becomeHostBtn = false;
      localStorage.setItem(CONSTANTS.ROLE, 'host');

      if (firstValue == 'guest') {
        this.router.navigateByUrl('/host');
      }
      else {
        window.location.reload();
        //this.router.navigateByUrl(this.router.url,{replaceUrl:true});
        // this.router.navigate(['/host'], { relativeTo: this.route, queryParams: { 'redirect': redirectValue } });
      }

    }
  } else {
    //jQuery\.noConflict\(\);
    $('#change_user_type').modal('show');
  }
}


ChangeRegistrationType(data: any) {
  if (data == 'existing') {
    this.changeTypeMethordChoosen = data
  } else if (data == 'new') {
    let role = localStorage.getItem(CONSTANTS.ROLE);
    this.logout()
    document.getElementById('closeUserTypeModal')?.click();
    this.loginContentFlag = false;
    this.forgotPasswordFlag = false;
    this.resetLinkFlag = false;
    this.registerFlag = false;
    this.registerAsContentFlag = false;
    this.registerAsGuestContentFlag = false;
    this.registerContentFlag = false;
    this.loginCongratulationsFlag = false;
    this.chooseHostOrGuestFlag = false;
    this.alreadyRegistered = false;

    if (role == 'guest') {
      this.registerContentFlag = true;
    } else {
      this.registerAsGuestContentFlag = true;
    }
    //jQuery\.noConflict\(\);
    $('#login_register').modal('show');
  } else {
    this.changeTypeMethordChoosen = null
  }


}

updateUserType() {
  this.apiService.post(environment.baseURL + ApiEndpoints.CHANGE_USER_TYPE, {}).subscribe((data: any) => {
    console.log("data", data)
    let user = this.user
    user.user_profile_type = data.data.user_profile_type
    user.user_status = data.data.user_status
    user.vaccinated = data.data.vaccinated
    user.user_type = data.data.user_type
    localStorage.setItem('userdata', JSON.stringify(user));
    this.sharedService.loginHeaderValue = false;
    if (
      data.data.user_type === CONSTANTS.USER_TYPE.GUEST_AND_HOST
    ) {
      this.loginContentFlag = false;
      this.chooseHostOrGuestFlag = true;
      localStorage.setItem(CONSTANTS.ROLE, 'guest');
      this.welcomeUserName = data.data.firstname;
    } else if (
      data.data.user_type === CONSTANTS.USER_TYPE.GUEST
    ) {
      document.getElementById('closeModal')?.click();
      this.becomeHostBtn = true;
      localStorage.setItem(CONSTANTS.ROLE, 'guest');
      this.router.navigateByUrl('/guest');
    } else if (
      data.data.user_type === CONSTANTS.USER_TYPE.HOST
    ) {
      document.getElementById('closeModal')?.click();
      this.becomeHostBtn = false;
      localStorage.setItem(CONSTANTS.ROLE, 'host');
      this.router.navigateByUrl('/host');
    }

    document.getElementById('closeUserTypeModal')?.click();
    // jQuery(this.loginModal.nativeElement).modal('show'); 
    //jQuery\.noConflict\(\);
    $('#login_register').modal('show');
  })
}

registerPopup(userType: any, guestType: any) {
  this.userTypeForm.patchValue({
    userType: userType
  });
  if (guestType) {
    this.guestTypeForm.patchValue({
      guestType: guestType
    });
  }


  this.loginContentFlag = false;
  this.forgotPasswordFlag = false;
  this.resetLinkFlag = false;
  this.registerFlag = false;
  this.registerAsContentFlag = false;
  this.registerAsGuestContentFlag = false;
  this.registerContentFlag = false;
  this.loginCongratulationsFlag = false;
  this.chooseHostOrGuestFlag = false;
  this.alreadyRegistered = false;
  this.registerContentFlag = true;
  //jQuery\.noConflict\(\);
  $('#login_register').modal('show');
}

loginPopup() {
  this.loginContentFlag = true;
  this.forgotPasswordFlag = false;
  this.resetLinkFlag = false;
  this.registerFlag = false;
  this.registerAsContentFlag = false;
  this.registerAsGuestContentFlag = false;
  this.registerContentFlag = false;
  this.loginCongratulationsFlag = false;
  this.chooseHostOrGuestFlag = false;
  this.alreadyRegistered = false;
  this.registerContentFlag = false;
  //jQuery\.noConflict\(\);
  $('#login_register').modal('show');
}


ngOnDestroy(): void {
  this.subscription ? this.subscription.unsubscribe() : '' ;
}

}
