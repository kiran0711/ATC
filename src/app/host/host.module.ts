import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HostRoutingModule } from './host-routing.module';
import { HostComponent } from './host.component';
import { HostDashboardComponent } from './dashboard/host-dashboard.component';
import { NiceSelectModule } from 'ng-nice-select';
import { PodsTableComponent } from '../pods-table/pods-table.component';
import { PodsTableModule } from '../pods-table/pods-table.module';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from '../shared/shared.modules';
import { PropertyListingCreateComponent } from './property-listing/create/property-listing-create.component';
import { FormsModule } from '@angular/forms';
import { PropertyListComponent } from './property-list/property-list.component';
import { PropertyLongTermListComponent } from './property-list/long-term-list/property-long-term-list.component';
import { PropertyShortTermListComponent } from './property-list/short-term-list/property-short-term-list.component';

@NgModule({
  declarations: [
    HostComponent,
    HostDashboardComponent,
    PropertyListComponent,
    PropertyListingCreateComponent,
    PropertyLongTermListComponent,
    PropertyShortTermListComponent,
  ],
  providers: [PodsTableComponent],
  imports: [
    CommonModule,
    FormsModule,
    HostRoutingModule,
    NiceSelectModule,
    PodsTableModule,
    DataTablesModule,
    SharedModule,
  ],
})
export class HostModule { }
