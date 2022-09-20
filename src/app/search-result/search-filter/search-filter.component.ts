import { Component, OnInit, Input, Output,EventEmitter, ChangeDetectorRef } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/shared/service/api.service';
import { PropertyService } from 'src/shared/service/property.service';
import { SharedService } from 'src/shared/service/shared.service';
import { ApiEndpoints } from 'src/shared/utils/api-url';
import { ActivatedRoute, NavigationExtras, Router,Params } from '@angular/router';
import { Options,LabelType } from "@angular-slider/ngx-slider";
declare var $: any ;

@Component({
  selector: 'search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.css']
})
export class SearchFilterComponent implements OnInit {
  spaceTypeData: Array<any>=[];
  propertyTypeData: Array<any>=[];
  propertyAttributes :any=[];
  distanceApplicable: boolean = false;
  
  options: Options = {
    floor: 0,
    ceil: 50,
    showTicks: false,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Floor:
          return "";
        default:
          return "" + value + " Km";
      }
    }
  };
  optionsPrice: Options = {
    floor: 0,
    ceil: 1000,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        default:
          return "$" + value + "";
      }
    }
  }

  request:any={
    room_type_id: [],
    property_type_id: [],
    distance: 25,
    min_price: 0,
    max_price: 1000,
  }

  @Output() onFilterChange: EventEmitter<any> = new EventEmitter();
  
  @Input() urlItem:any;
  constructor(
    private apiService: ApiService,
    private sharedService: SharedService,
    private router: Router,
    private ref: ChangeDetectorRef 
    ) { }

  async ngOnInit() {
    await this.getPropertyTypes()
    //jQuery\.noConflict\(\);
    $(document).on('shown.bs.modal', '#filer_block', () => {
      this.resetFilterInitial()
    });
  }

  resetFilterInitial() {
    this.request=JSON.parse(JSON.stringify(this.urlItem))
    this.distanceApplicable = this.request['lat'] != null && this.request['lng'] != null;
    if(!this.request.distance){
      this.request.distance=25
    }
    if(!this.request.min_price){
      this.request.min_price=0
    }
    if(!this.request.max_price){
      this.request.max_price=50000
    }
    if(!this.request.room_type_id){
      this.request.room_type_id=[]
    }else if(this.propertyAttributes.length<=0){
      let categoryId=this.request.room_type_id.join(",")
      let req = { category_ids: categoryId, property_term: 0 };
      this.getPropertyAttributeByCat(req);
    }
    if(!this.request.property_type_id){
      this.request.property_type_id=[]
    }
    this.ref.detectChanges();
  }

  increaseCounter(key:string){
    if(this.request[key]!=null){
      let keyObject=this.propertyAttributes.filter((x:any)=> x.attr_key==key)
      if(this.request[key]<keyObject[0].max_val){
        this.request[key]= ++this.request[key]
      }else{
        this.request[key]=keyObject[0].max_val
      }
    }else{
      let keyObject=this.propertyAttributes.filter((x:any)=> x.attr_key==key)
      this.request[key]=keyObject[0].min_val
    }
  }

  decreaseCounter(key:string){
    if(this.request[key]!=null){
      let keyObject=this.propertyAttributes.filter((x:any)=> x.attr_key==key)
      if(this.request[key]!=keyObject[0].min_val){
        this.request[key]= --this.request[key]
      }else{
        this.request[key]=keyObject[0].min_val
      }
      
    }else{
      let keyObject=this.propertyAttributes.filter((x:any)=> x.attr_key==key)
      this.request[key]=keyObject[0].min_val
    }
  }

  getPropertyTypes() {
    this.apiService.post(environment.baseURL + ApiEndpoints.GET_PROPERTY_TYPES, {})
    .subscribe((data: any) => {
      this.spaceTypeData = data.data.type_of_space;
      this.propertyTypeData = data.data.property_type;

    });

  }

  getPropertyAttributeByCat(params:any) {
    this.apiService.post(environment.baseURL + ApiEndpoints.GET_ATTRIBUTE_BY_CAT, params,false)
    .subscribe(
      (data) => {
        this.propertyAttributes=[]
        data.data.attributes.forEach((element:any) => {
          if(element.is_filter){
            this.propertyAttributes.push(element)
            if(element.input_type=='range'){
              this.request[element.attr_key]=element.min_val
            }
          }
        });
        // this.propertyAttributes = data.data.attributes;
        // let keys=Object.keys(this.request)
        // keys.forEach((element:any) => {
        //   if(!((element='space_type') || (element='prop_type')|| (element='min_price') || (element='max_price'))){
        //     delete this.request[element];
        //   }
        // });
        
        console.log(this.request)
      },
      (error) => {
        
      }
    );
   
  }

  onSpaceTypeChanged(e:any){
    if(this.request.room_type_id.includes(e.target.value)){
      let index= this.request.room_type_id.indexOf(e.target.value);
      this.request.room_type_id.splice(index,1);
    }else{
      this.request.room_type_id.push(e.target.value)
    }
    console.log(this.request)
    if(this.request.room_type_id && this.request.room_type_id.length){
      let categoryId=this.request.room_type_id.join(",")
      let req = { category_ids: categoryId, property_term: 0 };
      this.getPropertyAttributeByCat(req);
    }else{
      this.propertyAttributes=[]
    }
  }

  onPropertyTypeChanged(e:any){
    if(this.request.property_type_id.includes(e.target.value)){
      let index= this.request.property_type_id.indexOf(e.target.value);
      this.request.property_type_id.splice(index,1);
    }else{
      this.request.property_type_id.push(e.target.value)
    }
    console.log(this.request)
  }

  attrChange(event:any,key:any){
    
    if(!this.request[key]){
      this.request[key]=event.target.value=='on'?true:false;
    }else{
      delete this.request[key]
    }
    console.log(this.request)
  }

  getAttrValue(key:any,type:any){
    if(this.request[key]){
      return this.request[key]
    }else if(type="toggle"){
      return false;
    }else{
      return 0
    }
  }

  clearFilter(){
    this.request={
      room_type_id:[],
      property_type_id:[],
      distance:25,
      min_price:0,
      max_price:1000,
    }
    if (!this.distanceApplicable) {
      delete this.request.distance;
    }
    this.propertyAttributes=[]
    // this.onFilterChange.emit(this.request)
  }

  submit(){
    if (!this.distanceApplicable) {
      delete this.request.distance;
    }
    this.onFilterChange.emit(this.request)
  }

  checkSpaceType(spaceTypeId:any):boolean{
    return this.request.room_type_id.includes(spaceTypeId.toString())
  }

  checkPropType(propTypeId:any):boolean{
    return this.request.property_type_id.includes(propTypeId.toString())
  }

}
