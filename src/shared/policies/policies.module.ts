import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoliciesRoutingModule } from './policies-routing.module';

import { CookieComponent } from './cookie/cookie.component';
import { RegistrationComponent } from './registration/registration.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { PricePaymentAndRefundComponent } from './price-payment-and-refund/price-payment-and-refund.component';
import { DisclosureOfInformationComponent } from './disclosure-of-information/disclosure-of-information.component';
import { IntellectualPropertyRightsComponent } from './intellectual-property-rights/intellectual-property-rights.component';
import { InternetBasedAdvertisingComponent } from './internet-based-advertising/internet-based-advertising.component';
import { ProhibitedActionsComponent } from './prohibited-actions/prohibited-actions.component';


@NgModule({
  declarations: [
    CookieComponent,
    RegistrationComponent,
    TermsAndConditionsComponent,
    PricePaymentAndRefundComponent,
    DisclosureOfInformationComponent,
    IntellectualPropertyRightsComponent,
    InternetBasedAdvertisingComponent,
    ProhibitedActionsComponent
  ],
  imports: [
    CommonModule,
    PoliciesRoutingModule
  ]
})
export class PoliciesModule { }
