import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router,Params } from '@angular/router';
import { PropertyService } from "./property-listing.service";

declare let $: any;
@Component({
  selector: 'app-property-listing',
  templateUrl: './property-listing.component.html',
  styleUrls: ['./property-listing.component.css'],
})
export class PropertyListingComponent implements OnInit,OnDestroy {
  propertyAddressFlag = true;
  pro_id:any
  constructor(private router: Router, 
    private _router: Router,
    private activatedRoute: ActivatedRoute,
    private propertyListingService:PropertyService) {}

  ngOnInit(): void {
    //jQuery\.noConflict\(\);
    $('.leftSidebar, .rightSidebar').theiaStickySidebar({
      additionalMarginTop: 100,
    });

    this.pro_id = this.activatedRoute.snapshot.queryParamMap.get('proId');
    console.log(this.pro_id) 
    if(!this.pro_id){
      const subscription = this.router.events.subscribe((val:any) => {
        // see also 
        // console.log(val) 
        this.pro_id = this.propertyListingService.getCurrentPropertyId()
        if(this.pro_id && val.url=='/host/property-listing/short-term/title'){
          this.router.navigateByUrl(val.url+"?proId="+this.pro_id);
        }

        // subscription.unsubscribe()
    });
    }
  }

  ngOnDestroy(){
    this.propertyListingService.property = null;
  }
  spaceImg = false;
  space(){
   
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
