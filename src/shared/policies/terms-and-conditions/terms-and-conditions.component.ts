import { Component, OnInit } from '@angular/core';
import { domain } from 'src/app/app.constants';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.css']
})
export class TermsAndConditionsComponent implements OnInit {
  domain:any = domain;

  constructor() { }

  ngOnInit(): void {
  }

}
