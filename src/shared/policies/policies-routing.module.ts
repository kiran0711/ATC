import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CookieComponent } from './cookie/cookie.component';
import { PoliciesComponent } from './policies.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { RegistrationComponent } from './registration/registration.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { PricePaymentAndRefundComponent } from './price-payment-and-refund/price-payment-and-refund.component';
import { DisclosureOfInformationComponent } from './disclosure-of-information/disclosure-of-information.component';
import { IntellectualPropertyRightsComponent } from './intellectual-property-rights/intellectual-property-rights.component';
import { InternetBasedAdvertisingComponent } from './internet-based-advertising/internet-based-advertising.component';
import { ProhibitedActionsComponent } from './prohibited-actions/prohibited-actions.component';

const routes: Routes = [
  {
    path: '',
    component: PoliciesComponent,
    children: [
      {
        path: '',
      },
      {
        path: 'privacy-policy',
        component: PrivacyComponent,
        data: {
          seo: {
            title: 'Privacy Policy | ',
            metaTags: [
              { name: 'description', content: '' },
            ]
          }
        }
      },
      {
        path: 'terms-and-conditions',
        component: TermsAndConditionsComponent,
        
      },
      {
        path: 'registration-policy',
        component: RegistrationComponent,
        
      },
      {
        path: 'price-payment-refund',
        component: PricePaymentAndRefundComponent,
      },
      {
        path: 'intellectual-property-rights',
        component: IntellectualPropertyRightsComponent,
      },
      {
        path: 'disclosure-of-information',
        component: DisclosureOfInformationComponent,
      },
      {
        path: 'internet-based-advertising',
        component: InternetBasedAdvertisingComponent,
      },
      {
        path: 'cookie-policy',
        component: CookieComponent,
      },
      {
        path: 'prohibited-actions',
        component: ProhibitedActionsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PoliciesRoutingModule { }
