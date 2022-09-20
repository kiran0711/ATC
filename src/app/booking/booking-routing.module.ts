import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingHistoryComponent } from './booking-history/booking-history.component';
import { ReviewBookingComponent } from './review-booking/review-booking.component';
import { PaymentGatewayComponent } from './payment-gateway/payment-gateway.component';
import { WalletComponent } from './wallet/wallet.component';
import { BookingDetailsComponent } from './booking-details/booking-details.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { BookingRequestDetailsComponent } from './booking-request-details/booking-request-details.component';
import { LongTermBookingRequestDetailsComponent } from './long-term/request-details/long-term-booking-request-details.component';

const routes: Routes = [
  { path: '', component: BookingHistoryComponent },
  { path: 'review', component: ReviewBookingComponent },
  { path: 'booking-history', component: BookingHistoryComponent },
  { path: 'stripe', component: PaymentGatewayComponent },
  { path: 'wallet', component: WalletComponent },
  { path: 'invoices', component: InvoicesComponent },
  { path: 'detail/:id', component: BookingDetailsComponent },
  { path: 'request-detail/:id', component: BookingRequestDetailsComponent },
  { path: 'invoice/:id/:type', component: InvoiceComponent },
  { path: 'long-term/request/detail/:id', component: LongTermBookingRequestDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookingRoutingModule { }
