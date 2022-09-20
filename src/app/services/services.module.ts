import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlumberComponent } from './plumber/plumber.component';
import { ElectricianComponent } from './electrician/electrician.component';
import { CleaningComponent } from './cleaning/cleaning.component';
import { FacilityManagementComponent } from './facility-management/facility-management.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    PlumberComponent,
    ElectricianComponent,
    CleaningComponent,
    FacilityManagementComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
  ]
})
export class ServicesModule { }
