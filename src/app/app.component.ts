import { Component } from '@angular/core';
import { SeoServiceService } from '../shared/service/seo-service.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { FacebookService, InitParams } from 'ngx-facebook';
import { filter, map, mergeMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'PodsLiving';
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private seoService: SeoServiceService, private facebookService: FacebookService) {
  }
  ngOnInit(): void {

    
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => this.activatedRoute),
      map((route) => {
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      filter((route) => route.outlet === 'primary'),
      mergeMap((route) => route.data),
    ).subscribe(data => {
      let seoData = data['seo'];
     if(seoData){
      this.seoService.updateTitle(seoData['title']);
      this.seoService.updateMetaTags(seoData['metaTags']);
     }
    });

    this.initFacebookService();
  }

  private initFacebookService(): void {
    const initParams: InitParams = { xfbml:true, version:'v14.0'};
    this.facebookService.init(initParams);
  }
}
