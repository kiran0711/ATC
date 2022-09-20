import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AmenitiesComponent } from './amenities/amenities.component';
import { DescribePropertyComponent } from './describe-property/describe-property.component';
import { ListingSubmittedComponent } from './listing-submitted/listing-submitted.component';
import { PropertyAddressComponent } from './property-address/property-address.component';
import { PropertySpaceTypeComponent } from './property-space-type/property-space-type.component';
import { UploadPhotosVideosComponent } from './upload-photos-videos/upload-photos-videos.component';
import { LeasingDetailsComponent } from './leasing-details/leasing-details.component';
import { LongTermPropertyListingComponent } from './long-term-property-listing.component';

const routes: Routes = [
  {
    path: '',
    component: LongTermPropertyListingComponent,
    children: [
      { path: 'title', component: PropertyAddressComponent },
      { path: 'property-space-type', component: PropertySpaceTypeComponent },
      { path: 'describe-property', component: DescribePropertyComponent },
      { path: 'amenities', component: AmenitiesComponent },
      { path: 'upload-photos-videos', component: UploadPhotosVideosComponent },
      { path: 'leasing-details', component: LeasingDetailsComponent },
      { path: 'listing-submitted', component: ListingSubmittedComponent }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LongTermPropertyListingRoutingModule { }
