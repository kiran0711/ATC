import { DEFAULT_CURRENCY_CODE, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from 'src/shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PreloginComponent } from './prelogin/prelogin.component';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { NiceSelectModule } from 'ng-nice-select';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { NotFoundComponent } from './not-found/not-found.component';
import {DatePipe} from '@angular/common';
import { SearchByComponent } from './search-by/search-by.component';
import { ServicesModule } from './services/services.module';
import { EmailVerificationComponent } from './email-verification/email-verification.component'
import { PodsTableModule } from "./pods-table/pods-table.module";
import { DataTablesModule } from "angular-datatables";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CURRENCY_FORMAT } from './app.constants';
import { FacebookModule } from 'ngx-facebook';
import { NgHelmetModule } from "ng-helmet";
import { NgxMaskModule } from 'ngx-mask';



@NgModule({
  declarations: [AppComponent, PreloginComponent, ComingSoonComponent, NotFoundComponent, SearchByComponent, EmailVerificationComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    DataTablesModule,
    SharedModule,
    ServicesModule,
    ReactiveFormsModule,
    RouterModule,
    AppRoutingModule,
    NgxSpinnerModule,
    NiceSelectModule,
    GooglePlaceModule,
    PodsTableModule,
    FacebookModule.forRoot(),
    BsDatepickerModule.forRoot(),
    NgxMaskModule.forRoot(),
    NgHelmetModule.forRoot({baseTitle: "| Replay Value",}),

  ],
  providers: [{provide: LocationStrategy, useClass: PathLocationStrategy}, DatePipe,    {provide: DEFAULT_CURRENCY_CODE, useValue: CURRENCY_FORMAT}
],
  bootstrap: [AppComponent],
})
export class AppModule {}
