import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AmenitiesComponent } from './amenities/amenities.component';
import { AvailableForComponent } from './available-for/available-for.component';
import { DescribePropertyComponent } from './describe-property/describe-property.component';
import { ListingSubmittedComponent } from './listing-submitted/listing-submitted.component';
import { LocationComponent } from './location/location.component';
import { LongTermPricingComponent } from './long-term-pricing/long-term-pricing.component';
import { MoreDetailsComponent } from './more-details/more-details.component';
import { PeakValuePricingComponent } from './peak-value-pricing/peak-value-pricing.component';
import { PropertyAddressComponent } from './property-address/property-address.component';
import { PropertyListingComponent } from './property-listing.component';
import { PropertySpaceTypeComponent } from './property-space-type/property-space-type.component';
import { SeasonalPricingManagementComponent } from './seasonal-pricing-management/seasonal-pricing-management.component';
import { SentForApprovalComponent } from './sent-for-approval/sent-for-approval.component';
import { SetCancellationPolicyComponent } from './set-cancellation-policy/set-cancellation-policy.component';
import { ShortTermPricingComponent } from './short-term-pricing/short-term-pricing.component';
import { UploadPhotosVideosComponent } from './upload-photos-videos/upload-photos-videos.component';
import { SeasonalCalendarComponent } from './seasonal-calendar/seasonal-calendar.component';

const routes: Routes = [
  {
    path: '',
    component: PropertyListingComponent,
    children: [
      {
        path: 'title',
        component: PropertyAddressComponent,
      },
      {
        path: 'property-space-type',
        component: PropertySpaceTypeComponent,
      },
      {
        path: 'describe-property',
        component: DescribePropertyComponent,
      },
      {
        path: 'more-details',
        component: MoreDetailsComponent,
      },
      {
        path: 'amenities',
        component: AmenitiesComponent,
      },
      {
        path: 'short-term-pricing',
        component: ShortTermPricingComponent,
      },
      {
        path: 'set-cancellation-policy',
        component: SetCancellationPolicyComponent,
      },
      {
        path: 'listing-submitted',
        component: ListingSubmittedComponent,
      },
      {
        path: 'peak-value-pricing',
        component: PeakValuePricingComponent,
      },
      {
        path: 'seasonal-pricing',
        component: SeasonalPricingManagementComponent,
      },
      {
        path: 'calendar',
        component: SeasonalCalendarComponent,
      },
      {
        path: 'upload-photos-videos',
        component: UploadPhotosVideosComponent,
      },
      {
        path: 'location',
        component: LocationComponent,
      },
      {
        path: 'sent-for-approval',
        component: SentForApprovalComponent,
      },
      {
        path: 'long-term-pricing',
        component: LongTermPricingComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PropertyListingRoutingModule {}
