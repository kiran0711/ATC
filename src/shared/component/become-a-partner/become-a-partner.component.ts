import { Component, OnInit } from '@angular/core';
import { domain } from 'src/app/app.constants';

@Component({
  selector: 'app-become-a-partner',
  templateUrl: './become-a-partner.component.html',
  styleUrls: ['./become-a-partner.component.css']
})
export class BecomeAPartnerComponent implements OnInit {
  domain:any = domain;
  constructor() { }

  ngOnInit(): void {
  }

}
