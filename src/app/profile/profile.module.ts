import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { GeneralInfoComponent } from './general-info/general-info.component';
import { ContactInfoComponent } from './contact-info/contact-info.component';
import { GovtIdComponent } from './govt-id/govt-id.component';
import { StudentInfoComponent } from './student-info/student-info.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SecurityComponent } from './security/security.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { TravellerInfoComponent } from './traveller-info/traveller-info.component';
import { ProfessionalInfoComponent } from './professional-info/professional-info.component';
import { NiceSelectModule } from 'ng-nice-select';
import { MyPreferencesComponent } from './my-preferences/my-preferences.component';
import { KycComponent } from './kyc/kyc.component';
import { ReferalsComponent } from './referals/referals.component';
import { TaxInfoComponent } from './tax-info/tax-info.component';
import { SharedModule } from '../shared/shared.modules';
import { PayoutComponent } from './payout/payout.component';

@NgModule({
  declarations: [
    ProfileComponent,
    GeneralInfoComponent,
    ContactInfoComponent,
    GovtIdComponent,
    StudentInfoComponent,
    SecurityComponent,
    TravellerInfoComponent,
    ProfessionalInfoComponent,
    MyPreferencesComponent,
    KycComponent,
    ReferalsComponent,
    TaxInfoComponent,
    PayoutComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProfileRoutingModule,
    BsDatepickerModule.forRoot(),
    GooglePlaceModule,
    NiceSelectModule,
    SharedModule
  ],
})
export class ProfileModule {}
