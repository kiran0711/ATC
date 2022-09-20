import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListViewComponent } from './list-view/list-view.component';
import { GridViewComponent } from './grid-view/grid-view.component';
import { SearchResultComponent } from './search-result.component';
import { RouterModule } from '@angular/router';
import { SearchResultRoutingModule } from './search-result-routing.module';
import { DetailViewComponent } from './detail-view/detail-view.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { GoogleMapsModule } from '@angular/google-maps';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { OwlModule } from 'ngx-owl-carousel';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { SearchFilterComponent } from './search-filter/search-filter.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { NiceSelectModule } from 'ng-nice-select';
import { LongTermDetailViewComponent } from './long-term-detail-view/long-term-detail-view.component';
import { LongTermComponent } from './long-term/long-term.component';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  declarations: [
    ListViewComponent,
    GridViewComponent,
    SearchResultComponent,
    DetailViewComponent,
    SearchFilterComponent,
    LongTermDetailViewComponent,
    LongTermComponent,
  ],
  imports: [
    CommonModule,
    SearchResultRoutingModule,
    RouterModule,
    FormsModule,
    OwlModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    InfiniteScrollModule,
    GoogleMapsModule,
    GooglePlaceModule,
    NgxSliderModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCZrIUBGN0aJOY6pRWnpkgISJ5bFMaKDwE',
      //libraries: ['places']

    }),
    ShareButtonsModule,
    ShareIconsModule,
    NiceSelectModule,
    NgxMaskModule.forRoot(),
  ],
  providers:[
    GoogleMapsAPIWrapper
  ],
})
export class SearchResultModule {}
