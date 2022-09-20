import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.css'],
})
export class GuestComponent implements OnInit {
  Images = [
    './assets/images/similar-properties.png',
    './assets/images/similar-properties.png',
    './assets/images/similar-properties.png',
    './assets/images/similar-properties.png',
    './assets/images/similar-properties.png',
    './assets/images/similar-properties.png',
    './assets/images/similar-properties.png',
    './assets/images/similar-properties.png',
    './assets/images/similar-properties.png',
  ];

  SlideOptions = { items: 3, dots: false, nav: true };
  CarouselOptions = { items: 3, dots: false, nav: true };
  constructor(private router: Router) {}

  ngOnInit(): void {}
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
