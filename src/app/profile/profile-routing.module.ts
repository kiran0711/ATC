import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactInfoComponent } from './contact-info/contact-info.component';
import { GeneralInfoComponent } from './general-info/general-info.component';
import { GovtIdComponent } from './govt-id/govt-id.component';
import { MyPreferencesComponent } from './my-preferences/my-preferences.component';
import { ProfessionalInfoComponent } from './professional-info/professional-info.component';
import { ProfileComponent } from './profile.component';
import { SecurityComponent } from './security/security.component';
import { StudentInfoComponent } from './student-info/student-info.component';
import { TravellerInfoComponent } from './traveller-info/traveller-info.component';
import { KycComponent } from './kyc/kyc.component';
import { ReferalsComponent } from './referals/referals.component';
import { TaxInfoComponent } from './tax-info/tax-info.component';
import { PayoutComponent } from './payout/payout.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    children: [
      {
        path: 'general-info',
        component: GeneralInfoComponent,
      },
      {
        path: 'contact',
        component: ContactInfoComponent,
      },
      {
        path: 'govt-id',
        component: GovtIdComponent,
      },
      {
        path: 'security',
        component: SecurityComponent,
      },
      {
        path: 'kyc',
        component: KycComponent,
      },
      {
        path: 'student-info',
        component: StudentInfoComponent,
      },
      {
        path: 'traveller-info',
        component: TravellerInfoComponent,
      },
      {
        path: 'professional-info',
        component: ProfessionalInfoComponent,
      },
      {
        path: 'preferences',
        component: MyPreferencesComponent,
      },
      {
        path: 'refer-and-earn',
        component: ReferalsComponent,
      },
      {
        path: 'tax-info',
        component: TaxInfoComponent,
      },
      {
        path: 'payout',
        component: PayoutComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
