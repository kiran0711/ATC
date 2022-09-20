import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HostDashboardComponent } from './dashboard/host-dashboard.component';
import { PropertyListingCreateComponent } from './property-listing/create/property-listing-create.component';
import { PropertyListComponent } from './property-list/property-list.component';
import { LongTermPropertyService } from './property-listing/long-term/long-term-property-listing.service';

const routes: Routes = [
  {
    path: '',
    component: HostDashboardComponent,
  },
  {
    path: 'property-list',
    component: PropertyListComponent,
  },
  {
    path: 'property-listing',
    children: [
      {
        path: '',
        component: PropertyListingCreateComponent,
      },
      {
        path: 'short-term',
        loadChildren: () =>
          import('./property-listing/short-term/property-listing.module').then(
            (m) => m.PropertyListingModule
          )
      },
      {
        path: 'long-term',
        loadChildren: () =>
          import('./property-listing/long-term/long-term-property-listing.module').then(
            (m) => m.LongTermPropertyListingModule
          )
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [LongTermPropertyService]
})
export class HostRoutingModule { }
