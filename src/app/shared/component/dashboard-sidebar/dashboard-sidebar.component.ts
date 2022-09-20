import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROLE } from 'src/app/app.constants';

@Component({
  selector: 'app-dashboard-sidebar',
  templateUrl: './dashboard-sidebar.component.html',
  styleUrls: ['./dashboard-sidebar.component.css']
})
export class DashboardSidebarComponent implements OnInit {
  
  dashboardLink:any;
  userCurrentlySelectedRole: string | null;

  constructor(
    private router: Router,
  ) { 
    this.userCurrentlySelectedRole = localStorage.getItem(ROLE);
  }

  ngOnInit(): void {    
    this.navigateDashboard();
  }
  
  navigateDashboard() {
    if (localStorage.getItem('userdata')) {

      let userStr = localStorage.getItem('userdata') || '{}';
      let user = JSON.parse(userStr);
      if (user.user_type === 1) {
        localStorage.setItem(ROLE, "guest")
        this.dashboardLink = 'guest';
        //this.router.navigateByUrl('/guest');
      } 
      else if (user.user_type === 2) {
        localStorage.setItem(ROLE, "guest")
        this.dashboardLink = 'host';
        //this.router.navigateByUrl('/host');
      } 
      else {
        let role = localStorage.getItem(ROLE)
        if (role == 'guest') {
          //this.router.navigateByUrl('/guest');
          this.dashboardLink = 'guest';

        } else {
          //this.router.navigateByUrl('/host');
          this.dashboardLink = 'host';

        }

      }
    }
  }
}
