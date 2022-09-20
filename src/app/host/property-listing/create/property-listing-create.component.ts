import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-property-listing-create',
  templateUrl: './property-listing-create.component.html',
  styleUrls: ['./property-listing-create.component.css']
})
export class PropertyListingCreateComponent implements OnInit {
  term:string = '';
  shortTerm:string = environment.imageURL;
  longTerm:string = environment.imageURL;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.shortTerm+= 'assets/images/short-term.jpg'
    this.longTerm+= 'assets/images/long-term.jpg'
  }
  next(){
    localStorage.setItem('term', this.term)
    this.router.navigateByUrl(`host/property-listing/${this.term}-term/title`);
  }

}
