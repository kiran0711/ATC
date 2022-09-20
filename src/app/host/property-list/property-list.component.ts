import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.css'],
})
export class PropertyListComponent implements OnInit,OnDestroy {
  term: any = 'short';
  subscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
  ) {
    this.subscription = new Subscription();
  }

  ngOnInit(): void {
    this.subscription = this.activatedRoute.queryParams.subscribe((queryParams: Params) => {
      if (Object.keys(queryParams).length !== 0) {
        this.term = queryParams.term;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription && this.subscription.unsubscribe();
  }
}