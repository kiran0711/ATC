import { Component, OnInit } from '@angular/core';
import { domain } from 'src/app/app.constants';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  domain:any = domain;

  constructor() { }

  ngOnInit(): void {
  }

}
