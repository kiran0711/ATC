import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PropertyListingRoutingModule } from './property-listing-routing.module';
import { PropertyListingComponent } from './property-listing.component';
import { PropertySpaceTypeComponent } from './property-space-type/property-space-type.component';
import { DescribePropertyComponent } from './describe-property/describe-property.component';
import { AvailableForComponent } from './available-for/available-for.component';
import { MoreDetailsComponent } from './more-details/more-details.component';
import { AmenitiesComponent } from './amenities/amenities.component';
import { PeakValuePricingComponent } from './peak-value-pricing/peak-value-pricing.component';
import { ShortTermPricingComponent } from './short-term-pricing/short-term-pricing.component';
import { LongTermPricingComponent } from './long-term-pricing/long-term-pricing.component';
import { SentForApprovalComponent } from './sent-for-approval/sent-for-approval.component';
import { LocationComponent } from './location/location.component';
import { UploadPhotosVideosComponent } from './upload-photos-videos/upload-photos-videos.component';
import { SetCancellationPolicyComponent } from './set-cancellation-policy/set-cancellation-policy.component';
import { PropertyAddressComponent } from './property-address/property-address.component';
import { NiceSelectModule } from 'ng-nice-select';
import { ListingSubmittedComponent } from './listing-submitted/listing-submitted.component';
import { ReactiveFormsModule } from '@angular/forms';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { GoogleMapsModule } from '@angular/google-maps';
import { SeasonalPricingManagementComponent } from './seasonal-pricing-management/seasonal-pricing-management.component';
import { PublishModalComponent } from "./publish-modal/publish-modal.component";
import { FormsModule } from '@angular/forms';
import { SeasonalCalendarComponent } from './seasonal-calendar/seasonal-calendar.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [
    PropertyListingComponent,
    PropertySpaceTypeComponent,
    DescribePropertyComponent,
    AvailableForComponent,
    MoreDetailsComponent,
    AmenitiesComponent,
    PeakValuePricingComponent,
    ShortTermPricingComponent,
    SetCancellationPolicyComponent,
    UploadPhotosVideosComponent,
    LocationComponent,
    SentForApprovalComponent,
    LongTermPricingComponent,
    PropertyAddressComponent,
    ListingSubmittedComponent,
    SeasonalPricingManagementComponent,
    PublishModalComponent,
    SeasonalCalendarComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NiceSelectModule,
    PropertyListingRoutingModule,
    GooglePlaceModule,
    GoogleMapsModule,
    FormsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    BsDatepickerModule.forRoot(),
  ],
})
export class PropertyListingModule {


  
}
