import { DEFAULT_CURRENCY_CODE, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuestRoutingModule } from './guest-routing.module';
import { GuestComponent } from './guest.component';
import { OwlModule } from 'ngx-owl-carousel';
import { GuestHomeComponent } from './guest-home/guest-home.component';
import { GuestDashboardComponent } from './guest-dashboard/guest-dashboard.component';
import { GuestStudentHomeComponent } from './guest-student-home/guest-student-home.component';
import { RouterModule } from '@angular/router';
import { PodsTableModule } from '../pods-table/pods-table.module';
import { DataTablesModule } from 'angular-datatables';

import { SharedModule } from '../shared/shared.modules';


@NgModule({
  declarations: [
    GuestComponent,
    GuestHomeComponent,
    GuestDashboardComponent,
    GuestStudentHomeComponent,
    
  ],
  imports: [CommonModule, GuestRoutingModule, OwlModule, RouterModule,PodsTableModule,DataTablesModule,SharedModule]
})
export class GuestModule {}
