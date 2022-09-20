import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertySpaceTypeComponent } from './property-space-type/property-space-type.component';
import { DescribePropertyComponent } from './describe-property/describe-property.component';
import { AmenitiesComponent } from './amenities/amenities.component';
import { UploadPhotosVideosComponent } from './upload-photos-videos/upload-photos-videos.component';
import { PropertyAddressComponent } from './property-address/property-address.component';
import { NiceSelectModule } from 'ng-nice-select';
import { ListingSubmittedComponent } from './listing-submitted/listing-submitted.component';
import { ReactiveFormsModule } from '@angular/forms';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { GoogleMapsModule } from '@angular/google-maps';
import { FormsModule } from '@angular/forms';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { LeasingDetailsComponent } from './leasing-details/leasing-details.component';
import { NgxMaskModule } from 'ngx-mask'
import { LongTermPropertyListingComponent } from './long-term-property-listing.component';
import { LongTermPropertyListingRoutingModule } from './long-term-property-listing-routing.module';
import { PublishModalComponent } from './publish-modal/publish-modal.component';

@NgModule({
  declarations: [
    LongTermPropertyListingComponent,
    PropertySpaceTypeComponent,
    DescribePropertyComponent,
    AmenitiesComponent,
    UploadPhotosVideosComponent,
    PropertyAddressComponent,
    ListingSubmittedComponent,
    LeasingDetailsComponent,
    PublishModalComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NiceSelectModule,
    LongTermPropertyListingRoutingModule,
    GooglePlaceModule,
    GoogleMapsModule,
    FormsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    BsDatepickerModule.forRoot(),
    NgxMaskModule.forRoot(),
  ],
})
export class LongTermPropertyListingModule {


  
}
