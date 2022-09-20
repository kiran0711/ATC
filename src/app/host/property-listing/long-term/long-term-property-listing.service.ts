import { Injectable } from '@angular/core';
import { ApiService } from 'src/shared/service/api.service';
import { ApiEndpoints } from 'src/shared/utils/api-url';
import { environment } from 'src/environments/environment';

@Injectable()

export class LongTermPropertyService {
  
  CREATE_PROPERTY_STEP_ONE = '/host/property-listing/long-term/title';
  CREATE_PROPERTY_STEP_TWO = '/host/property-listing/long-term/property-space-type';
  CREATE_PROPERTY_STEP_THREE = '/host/property-listing/long-term/describe-property';
  CREATE_PROPERTY_STEP_FOUR = '/host/property-listing/long-term/amenities';
  CREATE_PROPERTY_STEP_FIVE = '/host/property-listing/long-term/upload-photos-videos';
  CREATE_PROPERTY_STEP_SIX = '/host/property-listing/long-term/leasing-details';

  property:any;

  constructor(
    private apiService: ApiService
  ){}

  async getpropertyById(proId:string) {
    if(!this.property || this.property?.step_zero?.pro_id != proId) {
      let resp:any = await this.apiService.getSync(environment.baseURL + ApiEndpoints.longTermProperty.GET_PROPERTY_DETAIL + proId);
      this.property = resp.data;
    }
  }

  getCurrentPropertyId() {
    return this.property?.step_zero?.pro_id;
  }

  getCurrentPropertyCategory() {
    return this.property?.step_one?.category_id;
  }


  getStepOne() {
    return this.property?.step_one?.pro_id;
  }
  getStepTwo() {
    return this.property?.step_two?.pro_id;
  }
  getStepThree() {
    return this.property?.step_three[0]?.pro_id;
  }
  getStepFive() {
    return this.property?.step_five?.pro_id;
  }
  getStepFour() {
    return this.property?.step_four[0]?.pro_id;
  }
}