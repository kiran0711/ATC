import { StringMapWithRename } from "@angular/compiler/src/compiler_facade_interface";

export class SearchReqModel{
    destination:string='';
    max_additional_guest_allow:string='';
    short_term:string='';
    long_term:string='';
    room_type_id:string='';
    property_type_id:string='';
    bedrooms:string='';
    beds:string='';
    baths:string='';
    startDate:String = '';
    endDate:string = '';
    page:number=1;
    per_page:number=10;
    pricesort="";
}