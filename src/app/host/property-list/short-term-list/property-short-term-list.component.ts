import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/shared/service/api.service';
import { SharedService } from 'src/shared/service/shared.service';
import { ApiEndpoints } from 'src/shared/utils/api-url';

@Component({
  selector: 'app-property-short-term-list',
  templateUrl: './property-short-term-list.component.html',
  styleUrls: ['./property-short-term-list.component.css']
})
export class PropertyShortTermListComponent implements OnInit,OnDestroy {
  properties: any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    private apiService: ApiService,
    private router: Router,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      retrieve: true
    };
    this.sharedService.propertyId = null
    this.fetchProperties();
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  fetchProperties() {
    this.apiService
      .post(environment.baseURL + ApiEndpoints.GET_PROPERTY_LIST, { user_id: this.sharedService.getUserDetails().user_id })
      .subscribe(
        (data: any) => {
          this.properties = data.data;
          this.dtTrigger.next();
        }, err => {
          console.log(err);
        }
      );
  }
  editProperty(id: any) {
    // if(!window.confirm('Are you Sure')){
    //   return;
    // }
    window.open(`/host/property-listing/short-term/title?proId=${id}`, 'new');
    //this.router.navigateByUrl('/host/property-listing/short-term/title?proId=' + id);
  }

  viewProperty(slug: any) {
    window.open(`/property/detail/${slug}`, 'new');
    // this.router.navigateByUrl('/property/detail/' + slug);
  }

  navigateDashboard() {
    if (localStorage.getItem('userdata')) {
      let userStr = localStorage.getItem('userdata') || '{}';
      let user = JSON.parse(userStr);
      if (user.user_type === 1) {
        this.router.navigateByUrl('/guest');
      } else {
        this.router.navigateByUrl('/host');
      }
    }
  }
}
