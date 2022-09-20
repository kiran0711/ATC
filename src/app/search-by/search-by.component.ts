import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  Params
} from '@angular/router';
import * as moment from 'moment';
import {
  environment
} from 'src/environments/environment';
import {
  ApiService
} from 'src/shared/service/api.service';
import {
  ApiEndpoints
} from 'src/shared/utils/api-url';
import { Location } from '@angular/common';

@Component({
  selector: 'app-search-by',
  templateUrl: './search-by.component.html',
  styleUrls: ['./search-by.component.css']
})
export class SearchByComponent implements OnInit {
  slug:any;
  type:any;
  title:any;
  bio:any;
  isLoading:any=true;
  properties:Array<any>=[];
  constructor(private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private location: Location) { 
    this.route.url.subscribe((params: any) => {
      this.type = params[0].path;
      switch (this.type) {
        case "top-destination":
          this.title="Top Destination";
          this.bio="Look no further for breath-taking Canadian sights within our top destinations."
          break;
        case "location":
          this.title="Location"
          break;
        case "university":
          this.title="University"
          break;
        default:
          this.title=null
          break;
      }
      this.properties=[];
      this.getTopProperty(this.type);
      // if(!this.type){
      //   this.router.navigateByUrl("/");
      // }
    });
  }

  ngOnInit(): void {
    
  }

  getTopProperty(type:any){
    let postData={
      "category_name":type,
      "page":"1",
      "per_page":"40"
    }
    this.isLoading=true;
    this.apiService.post(environment.baseURL + ApiEndpoints.GET_TOP_DESTINATION_BY_CATEGORY, postData)
      .subscribe((data: any) => {
          this.isLoading=false;
          this.properties=data.data.data
      },((error:any)=>{
        this.isLoading=false;
      }));
  }

  back(): void {
    this.location.back();
  }


}
