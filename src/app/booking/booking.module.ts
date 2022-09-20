import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { RouterModule } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { NgxStripeModule } from 'ngx-stripe';
import { PodsTableComponent } from '../pods-table/pods-table.component';
import { PodsTableModule } from '../pods-table/pods-table.module';
import { BookingDetailsComponent } from './booking-details/booking-details.component';
import { BookingHistoryComponent } from './booking-history/booking-history.component';
import { BookingRoutingModule } from './booking-routing.module';
import { CompletePaymentComponent } from './complete-payment/complete-payment.component';
import { ConfirmBookingComponent } from './confirm-booking/confirm-booking.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { PaymentGatewayComponent } from './payment-gateway/payment-gateway.component';
import { ReviewBookingComponent } from './review-booking/review-booking.component';
import { WalletComponent } from './wallet/wallet.component';
import { NgxPrintModule } from 'ngx-print'
import { SharedModule } from '../shared/shared.modules';
import { NiceSelectModule } from 'ng-nice-select';
import { BookingRequestDetailsComponent } from './booking-request-details/booking-request-details.component';
import { LongTermBookingRequestDetailsComponent } from './long-term/request-details/long-term-booking-request-details.component';
import { AgmCoreModule } from '@agm/core';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { OwlModule } from 'ngx-owl-carousel';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { NgxMaskModule } from 'ngx-mask';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaymentComponent } from './long-term/request-details/payment/payment.component';



@NgModule({
  declarations: [
    CompletePaymentComponent,
    ReviewBookingComponent,
    ConfirmBookingComponent,
    BookingHistoryComponent,
    PaymentGatewayComponent,
    WalletComponent,
    BookingDetailsComponent,
    InvoicesComponent,
    InvoiceComponent,
    BookingRequestDetailsComponent,
    LongTermBookingRequestDetailsComponent,
    PaymentComponent
  ],
  providers:[PodsTableComponent],
  imports: [
    CommonModule,
    RouterModule,
    PodsTableModule,
    FormsModule,
    NiceSelectModule,
    ReactiveFormsModule,
    BookingRoutingModule,
    GoogleMapsModule,
    DataTablesModule,
    NgxPrintModule,
    NgxStripeModule.forChild(),
    SharedModule,
    OwlModule,
    BsDatepickerModule.forRoot(),
    InfiniteScrollModule,
    GooglePlaceModule,
    NgxSliderModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCZrIUBGN0aJOY6pRWnpkgISJ5bFMaKDwE'
    }),
    ShareButtonsModule,
    ShareIconsModule,
    NgxMaskModule.forRoot(),
    NgSelectModule
  ]
})
export class BookingModule { }
