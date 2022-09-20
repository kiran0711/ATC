import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { GuestDashboardComponent } from './guest-dashboard/guest-dashboard.component';
import { GuestHomeComponent } from './guest-home/guest-home.component';
import { GuestStudentHomeComponent } from './guest-student-home/guest-student-home.component';
import { GuestComponent } from './guest.component';

const routes: Routes = [
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: '',
        component: GuestDashboardComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'dashboard',
        component: GuestDashboardComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'student',
        component: GuestStudentHomeComponent,
        
      },
      
    
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GuestRoutingModule {}
