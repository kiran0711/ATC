import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { PropertyService } from 'src/shared/service/property.service';
import { SearchReqModel } from '../../models/reqmodels/reqSearchProperty.model';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/shared/service/api.service';
import { SharedService } from 'src/shared/service/shared.service';
import { ApiEndpoints } from 'src/shared/utils/api-url';
import * as CONSTANTS from "src/app/app.constants";


@Component({
  selector: 'app-guest-student-home',
  templateUrl: './guest-student-home.component.html',
  styleUrls: ['./guest-student-home.component.css'],
})
export class GuestStudentHomeComponent implements OnInit {
  Images = [
    './assets/images/p1.png',
    './assets/images/p2.png',
    './assets/images/p3.png',
    './assets/images/p4.png',
    './assets/images/p1.png',
  ];

  Images1 = [
    './assets/images/f1.png',
    './assets/images/f2.png',
    './assets/images/f3.png',
    './assets/images/f1.png',
  ];

  Images2 = [
    './assets/images/s1.png',
    './assets/images/s2.png',
    './assets/images/s3.png',
    './assets/images/s1.png',
  ];

  Images3 = [
    './assets/images/b1.jpg',
    './assets/images/b2.jpg',
    './assets/images/b3.jpg',
    './assets/images/b4.jpg',
    './assets/images/b1.jpg',
  ];

  SlideOptions = { items: 4, dots: false, nav: true };
  CarouselOptions = { items: 4, dots: false, nav: true };
  CarouselSlideOptions = { items: 4, dots: false, nav: true };
  imageUrl = environment.imageURL;
  topDestinations:Array<any>=[]
  masterAmenities:Array<any>=[];
  masterFacilities:Array<any>=[];
  typeOfProperty:Array<any>=[];
  constructor(
    private router: Router,
    private _propertyService:PropertyService,
    private apiService: ApiService,
    private sharedService: SharedService
    ) { }

  async ngOnInit() {
    let resp:any = await this.apiService.postSync(environment.baseURL + ApiEndpoints.GET_PROPERTY_TYPES, {});
    resp.data.property_type.forEach((element:any) => {
      if(element.is_home){
        this.typeOfProperty.push(element)
      }
    });
    this.getTopDestination()
    this.getServicesMasterList()
  }

  getTopDestination(){
    let postData={
      "category_name":"university",
      "page":"1",
      "per_page":"40"
    }
    this.apiService.post(environment.baseURL + ApiEndpoints.GET_TOP_DESTINATION_BY_CATEGORY, postData)
      .subscribe((data: any) => {
        
          this.topDestinations=data.data.data
      });
  }

  get user(){
    let userStr = localStorage.getItem('userdata') || '{}';
    return JSON.parse(userStr);
  }

  searchByAminity(type:any){
    console.log(type)
    this.router.navigateByUrl("/properties?services="+type)
  }

  searchByProperty(type:any){
    console.log(type)
    this.router.navigateByUrl("/properties?property_type_id="+type)
  }

  getServicesMasterList() {
    this.apiService.post(environment.baseURL + ApiEndpoints.SERVICES_MASTER_LIST, {})
      .subscribe(
        (data) => {
          console.log(data);
          this.masterAmenities=[]
          data.data.amenities_list.forEach((element:any) => {
            if(element.is_home){
              this.masterAmenities.push(element)
            }
          });
          // this.masterAmenities = data.data.amenities_list;
          // this.masterFacilities = data.data.facilities_list;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  openRegister(){
    // debugger
    // this.header.registerPopup()
    if(this.user && (this.user.user_type==CONSTANTS.USER_TYPE.HOST || this.user.user_type==CONSTANTS.USER_TYPE.GUEST_AND_HOST)){
      this.router.navigateByUrl('/host/property-listing/title')
    }else if(this.user.user_type){
      this.sharedService.changeRegTypeOrRegister.next({ loginStatus: true })
    }else{
      this.sharedService.openRegisterPopup.next({ loginStatus: false,userType:2 })
    }
    // this.sharedService.openRegisterPopup.next({ loginStatus: true })
  }
}
