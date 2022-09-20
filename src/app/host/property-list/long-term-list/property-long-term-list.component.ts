import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/shared/service/api.service';
import { SharedService } from 'src/shared/service/shared.service';
import { ApiEndpoints } from 'src/shared/utils/api-url';

@Component({
  selector: 'app-property-long-term-list',
  templateUrl: './property-long-term-list.component.html',
  styleUrls: ['./property-long-term-list.component.css']
})
export class PropertyLongTermListComponent implements OnInit,OnDestroy {

  properties: any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  loginUser: any;

  constructor(
    private apiService: ApiService,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.loginUser = this.sharedService.getUserDetails();
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
    this.apiService.post(environment.baseURL + ApiEndpoints.longTermProperty.GET_PROPERTY_LIST, {user_id:this.loginUser.user_id}).subscribe((data: any) => {
      this.properties = data.data;
      this.dtTrigger.next();
    }, err => {
      console.log(err);
    })
  }
  editProperty(id: any) {
    // if (!window.confirm('Are you Sure')) {
    //   return;
    // }
    window.open(`/host/property-listing/long-term/title?proId=${id}`, 'new');
  }
  viewProperty(slug: any) {
    window.open(`/property/long-term/detail/${slug}`, 'new');
  }
}
