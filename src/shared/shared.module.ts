import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './component/header/header.component';
import { FooterComponent } from './component/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { ApiInterceptorService } from './service/api-interceptor.service';

import {
  RecaptchaFormsModule,
  RecaptchaModule,
  RecaptchaSettings,
  RECAPTCHA_SETTINGS,
} from 'ng-recaptcha';
import { environment } from 'src/environments/environment';
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialAuthServiceConfig,
  SocialLoginModule,
} from 'angularx-social-login';
import { RouterModule } from '@angular/router';
import { NiceSelectModule } from 'ng-nice-select';
import { ContactUsComponent } from './component/contact-us/contact-us.component';
import { OwlModule } from 'ngx-owl-carousel';
import { PoliciesComponent } from './policies/policies.component';
import { PrivacyComponent } from './policies/privacy/privacy.component';
import { InformationCenterComponent } from './component/information-center/information-center.component';
import { HowItWorksComponent } from './component/how-it-works/how-it-works.component';
import { CareerComponent } from './component/career/career.component';
import { AboutComponent } from './component/about/about.component';
import { FaqComponent } from './component/faq/faq.component';
import { WebinarComponent } from './webinar/webinar.component';
import { CdTimerModule } from 'angular-cd-timer';
import { BecomeAPartnerComponent } from './component/become-a-partner/become-a-partner.component';
import { HowItWorksPartnerComponent } from './component/how-it-works-partner/how-it-works-partner.component';
import { HowItWorksHostComponent } from './component/how-it-works-host/how-it-works-host.component';
import { BnNgIdleService } from 'bn-ng-idle';
import { WhatMakesUsSpecialComponent } from './component/what-makes-us-special/what-makes-us-special.component';
import { MobileLoginComponent } from './component/mobile-login/mobile-login.component';
@NgModule({
  declarations: [HeaderComponent, FooterComponent, ContactUsComponent, PoliciesComponent, PrivacyComponent, InformationCenterComponent, HowItWorksComponent, CareerComponent, AboutComponent, FaqComponent, WebinarComponent, BecomeAPartnerComponent, HowItWorksPartnerComponent, HowItWorksHostComponent, WhatMakesUsSpecialComponent, MobileLoginComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptorService,
      multi: true,
    },
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: environment.recaptcha.siteKey,
      } as RecaptchaSettings,
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '827392383421-ducv3nvs88etk0g448sb6ieprrqspcmf.apps.googleusercontent.com'
            ),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('380749490088795'),
          },
        ],
      } as SocialAuthServiceConfig,
    },
    BnNgIdleService 
  ],
  imports: [
    CommonModule,
    FormsModule,
    CdTimerModule,
    RouterModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxSpinnerModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      closeButton: true,
      disableTimeOut: true,
    }),
    BsDatepickerModule.forRoot(),
    RecaptchaModule,
    RecaptchaFormsModule,
    SocialLoginModule,
    NiceSelectModule,
    OwlModule,

  ],
  exports: [HeaderComponent, FooterComponent, WhatMakesUsSpecialComponent],
})
export class SharedModule {}
