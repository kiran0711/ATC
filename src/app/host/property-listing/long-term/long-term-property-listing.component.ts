import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router,Params } from '@angular/router';
import { LongTermPropertyService } from './long-term-property-listing.service';

declare let $: any;
@Component({
  selector: 'app-long-term-property-listing',
  templateUrl: './long-term-property-listing.component.html',
  styleUrls: ['./long-term-property-listing.component.css'],
})
export class  LongTermPropertyListingComponent implements OnInit,OnDestroy {

  propertyAddressFlag = true;
  pro_id:any
  spaceImg = false;

  constructor(private router: Router, 
    private _router: Router,
    private activatedRoute: ActivatedRoute,
    private propertyListingService: LongTermPropertyService) {}

  ngOnInit(): void {
    //jQuery\.noConflict\(\);
    $('.leftSidebar, .rightSidebar').theiaStickySidebar({
      additionalMarginTop: 100,
    });
    this.pro_id = this.activatedRoute.snapshot.queryParamMap.get('proId');
    if(!this.pro_id){
      this.router.events.subscribe((val:any) => {
        // see also 
        // console.log(val) 
        this.pro_id = this.propertyListingService.getCurrentPropertyId()
        if(this.pro_id && val.url=='/host/property-listing/long-term/title'){
          this.router.navigateByUrl(val.url+"?proId="+this.pro_id);
        }
    });
    }
  }

  ngOnDestroy(){
    this.propertyListingService.property = null;
  }

  /**
   * Check if the router url contains the specified route
   *
   * @param {string} route
   * @returns
   * @memberof MyComponent
   */
 hasRoute(route: string) {
  return this._router.url.includes(route);
}
}
