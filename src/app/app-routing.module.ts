import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactUsComponent } from 'src/shared/component/contact-us/contact-us.component';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { CompletePaymentComponent } from './booking/complete-payment/complete-payment.component';
import { ConfirmBookingComponent } from './booking/confirm-booking/confirm-booking.component';
import { ReviewBookingComponent } from './booking/review-booking/review-booking.component';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { PreloginComponent } from './prelogin/prelogin.component';
import { DetailViewComponent } from './search-result/detail-view/detail-view.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { BookingHistoryComponent } from './booking/booking-history/booking-history.component';
import { InformationCenterComponent } from 'src/shared/component/information-center/information-center.component';
import { SearchByComponent } from './search-by/search-by.component';
import { HowItWorksComponent } from 'src/shared/component/how-it-works/how-it-works.component';
import { HowItWorksHostComponent } from 'src/shared/component/how-it-works-host/how-it-works-host.component';
import { HowItWorksPartnerComponent } from 'src/shared/component/how-it-works-partner/how-it-works-partner.component';
import { CareerComponent } from 'src/shared/component/career/career.component';
import { CleaningComponent } from './services/cleaning/cleaning.component';
import { ElectricianComponent } from './services/electrician/electrician.component';
import { PlumberComponent } from './services/plumber/plumber.component';
import { FacilityManagementComponent } from './services/facility-management/facility-management.component';
import { AboutComponent } from 'src/shared/component/about/about.component';
import { FaqComponent } from 'src/shared/component/faq/faq.component';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { PaymentGatewayComponent } from './booking/payment-gateway/payment-gateway.component';
import { WebinarComponent } from '../shared/webinar/webinar.component';
import { BecomeAPartnerComponent } from 'src/shared/component/become-a-partner/become-a-partner.component';

import { GuestStudentHomeComponent } from './guest/guest-student-home/guest-student-home.component';
import { GuestDashboardComponent } from './guest/guest-dashboard/guest-dashboard.component';
import { GuestHomeComponent } from './guest/guest-home/guest-home.component';
import { LongTermDetailViewComponent } from './search-result/long-term-detail-view/long-term-detail-view.component';
import { MobileLoginComponent } from './../shared/component/mobile-login/mobile-login.component';

const routes: Routes = [

  //modules with authentication
  { path: 'host', loadChildren: () => import('./host/host.module').then((m) => m.HostModule), canActivate: [AuthGuard] },
  { path: 'profile', loadChildren: () => import('./profile/profile.module').then((m) => m.ProfileModule), canActivate: [AuthGuard] },

  //modules without authentication
  { path: 'guest', loadChildren: () => import('./guest/guest.module').then((m) => m.GuestModule) },
  { path: 'policies', loadChildren: () => import('src/shared/policies/policies.module').then((m) => m.PoliciesModule) },
  { path: 'properties', loadChildren: () => import('./search-result/search-result.module').then((m) => m.SearchResultModule) },
  { path: 'booking', loadChildren: () => import('./booking/booking.module').then((m) => m.BookingModule) },

  //components
  { path: '', component: PreloginComponent, data: { seo: { title: 'Lease Apartments & Houses for Rent in Canada', metaTags: [{ name: 'description', content: 'Pods Living is designed to find out rental apartment, vacation home, studio, condos, commercial property for short/long-term duration at affordable price in Canada.' }] } } },
  { path: 'comingsoon', component: ComingSoonComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contactus', component: ContactUsComponent },
  { path: 'information-center', component: InformationCenterComponent },
  { path: 'career', component: CareerComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'webinar', component: WebinarComponent },
  {
    path: 'top-destination', pathMatch: 'full', component: SearchByComponent,
    data: { seo: { title: 'Rental Property in Top Destination | Canada Vacation Home or Apartment', metaTags: [{ name: 'description', content: 'Get the best rental place at top destination place of Canada, either for office meeting or on vacation with family. Full accommodation with proper hygiene in apartment.' }] } }
  },
  {
    path: 'student-accommodation',
    component: GuestStudentHomeComponent,
    data: { seo: { title: 'Student Accommodation & Housing Services | Living Off Campus', metaTags: [{ name: 'description', content: 'If you are looking for safe & budget friendly off-campus student housing apartment that are close to college or university, you have come to the right place.' }] } }
  },
  {
    path: 'traveller-home-stay',
    component: GuestHomeComponent,
    data: { seo: { title: 'Vacation Rental Home for Travelers | Condo Appartment', metaTags: [{ name: 'description', content: 'Are you wondering how to find short-term housing for your next travel assignment? Get incredible rental vacation home experience during extended stay business travel.' }] } }
  },
  {
    path: 'long-term-accommodation',
    component: GuestHomeComponent,
  },
  {
    path: 'university', pathMatch: 'full', component: SearchByComponent,
    data: { seo: { title: 'Student Accommendation Near Universities | Budget Friendly Rental Apartment', metaTags: [{ name: 'description', content: 'Find the best place for off campus residential property or apartment for students nearby your college or university. Houses and Aapartments in the neighborhood adjacent to the campus.' }] } }
  },
  {
    path: 'location', pathMatch: 'full', component: SearchByComponent,
    data: { seo: { title: 'Lease Property in Popular Cities | Canada Vacation Rentals', metaTags: [{ name: 'description', content: 'Looking for short term or long-term rental property in popular cities of Canada. Apartment, Condos, House, Airbnb for professional or family trip in Canada.' }] } }
  },
  { path: 'verification-success', pathMatch: 'full', component: EmailVerificationComponent },
  { path: 'verification-failed', pathMatch: 'full', component: EmailVerificationComponent },
  { path: 'how-it-works', component: HowItWorksComponent },
  { path: 'how-it-works-host', component: HowItWorksHostComponent },
  { path: 'how-it-works-partner', component: HowItWorksPartnerComponent },
  { path: 'become-a-partner', component: BecomeAPartnerComponent },
  { path: 'services/cleaning', component: CleaningComponent },
  { path: 'services/electrician', component: ElectricianComponent },
  { path: 'services/plumber', component: PlumberComponent },
  { path: 'services/facility-management', component: FacilityManagementComponent },
  { path: 'property/detail/:slug', component: DetailViewComponent },
  { path: 'property/long-term/detail/:slug', component: LongTermDetailViewComponent },
  { path: 'booking/payments', component: CompletePaymentComponent },
  { path: 'booking/booking-confirm', component: ConfirmBookingComponent },
  { path: 'mlogin', component: MobileLoginComponent },

  //for 404 request
  { path: '**', pathMatch: 'full', component: NotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    onSameUrlNavigation: 'reload',
    initialNavigation: 'enabled'
}),
  ],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule { }
