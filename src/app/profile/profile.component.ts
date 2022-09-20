import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/shared/service/api.service';
import { ApiEndpoints } from 'src/shared/utils/api-url';
import * as CONSTANTS from 'src/app/app.constants';
import { SharedService } from 'src/shared/service/shared.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  guest = '';
  link = '';
  isHost = false;
  currentRoleText: string | null;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private sharedService: SharedService
  ) {
    if (localStorage.getItem('userdata')) {
      let userStr = localStorage.getItem('userdata') || '{}';
      let user = JSON.parse(userStr);
      if (user.user_type === CONSTANTS.USER_TYPE.HOST) {
        this.isHost = true;
      } else if (
        user.user_type === CONSTANTS.USER_TYPE.GUEST_AND_HOST &&
        (this.sharedService.userPerspectiveValue == CONSTANTS.HOST ||
          localStorage.getItem('userPerspective') == CONSTANTS.HOST)
      ) {
        this.isHost = true;
      } else {
        this.isHost = false;
      }
      if (
        user.user_type === CONSTANTS.USER_TYPE.GUEST ||
        (user.user_type === CONSTANTS.USER_TYPE.GUEST_AND_HOST &&
          (this.sharedService.userPerspectiveValue === CONSTANTS.GUEST ||
            localStorage.getItem('userPerspective') == CONSTANTS.GUEST))
      ) {
        if (user.user_profile_type === CONSTANTS.USER_PROFILE.STUDENT) {
          this.guest = 'Student';
          this.link = 'student-info';
        } else if (
          user.user_profile_type === CONSTANTS.USER_PROFILE.PROFESSIONAL
        ) {
          this.guest = 'Professional';
          this.link = 'professional-info';
          this.isHost = true;
        } else if (
          user.user_profile_type === CONSTANTS.USER_PROFILE.TRAVELLER
        ) {
          this.guest = 'Traveller';
          this.link = 'traveller-info';
          this.isHost = true;
        }
      }
    }
  }

  ngOnInit(): void {
    this.currentRoleText = localStorage.getItem(CONSTANTS.ROLE)

  }
  navigateDashboard() {
    if (localStorage.getItem('userdata')) {
      let userStr = localStorage.getItem('userdata') || '{}';
      let user = JSON.parse(userStr);
      if (user.user_type === 1) {
        this.router.navigateByUrl('/guest');
      } else if (user.user_type === 2) {
        this.router.navigateByUrl('/host');
      } else {
        this.router.navigateByUrl('/guest');
      }
    }
  }
}
