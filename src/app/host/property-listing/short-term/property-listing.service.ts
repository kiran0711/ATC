import { Injectable } from '@angular/core';
import { ApiService } from 'src/shared/service/api.service';
import { ApiEndpoints } from 'src/shared/utils/api-url';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PropertyService {

  CREATE_PROPERTY_STEP_ONE = '/host/property-listing/short-term/title';
  CREATE_PROPERTY_STEP_TWO = '/host/property-listing/short-term/property-space-type';
  property:any;

  constructor(
    private apiService: ApiService
  ){}

  async getpropertyById(proId:string) {
    if(!this.property || this.property?.step_zero?.pro_id != proId) {
      let resp:any = await this.apiService.getSync(environment.baseURL + ApiEndpoints.GET_PROPERTY_DETAIL + proId);
      this.property = resp.data;
    }
  }

  getCurrentPropertyId() {
    return this.property?.step_zero?.pro_id;
  }

  getCurrentPropertyCategory() {
    return this.property?.step_one?.category_id;
  }

}