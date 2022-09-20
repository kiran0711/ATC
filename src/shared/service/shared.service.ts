import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import * as CONSTANTS from 'src/app/app.constants';


@Injectable({
  providedIn: 'root',
})
export class SharedService {
  loginHeader: BehaviorSubject<boolean>;
  userPerspective: BehaviorSubject<string>;
  userProfilePicturePath: string = '';
  propertyId: any = null;
  categoryId: any = null;
  userDisplayName: BehaviorSubject<string>;
  userProfilePicture: BehaviorSubject<string>;
  proSlug: any = null;
  bookingSession: any = null
  // propertySession:any={
  //   pro_id:39,
  //   step1:{
  //     "user_id": 92,
  //     "pro_title": "Test Shubham 2",
  //     "pro_slug": "test-shubham-2",
  //     "google_address": "Prasad Mansion, Harnichak, Beur, Patna 2",
  //     "address1": "Prasad Mansion, Harnichak, Beur, Patna 2",
  //     "address2": null,
  //     "city": "Patna",
  //     "state": "Bihar",
  //     "postal_code": "800002",
  //     "latitude": "25.5759284",
  //     "longitude": "85.0929751",
  //     "country_region": "India",
  //     "timezone": "India Standard Time",
  //     "created_on": "2021-12-11 19:02:24",
  //     "updated_on": "2021-12-11 19:02:37"
  //   },
  //   step2:{
  //     "category_id": 8,
  //     "property_type_id": 7,
  //     "short_term": 1,
  //     "min_stay_in_day": 1,
  //     "STR_number": "abc",
  //     "long_term": 1,
  //     "min_stay_in_month": 1
  //   },
  //   step3:{
  //     "property_description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla congue, magna eu dignissim tincidunt, felis dolor auctor nunc, et egestas ex dui quis ipsum. Sed sed tellus ac dolor vehicula lobortis sit amet ut nisl. Donec et nunc non ante blandit dapibus. Maecenas fringilla varius eros. Aliquam erat volutpat. Fusce et justo vulputate, sollicitudin velit sit amet, finibus magna. Sed tempus erat mi, eu fringilla diam maximus et. Pelle",
  //     "allow_sharing": 1,
  //     "room_type_id": null,
  //     "pro_id": 39,
  //     "STR_number": "abc",
  //     "bedrooms": 2,
  //     "beds": 2,
  //     "baths": 2
  //   },
  //   step4:{
  //     "pets": 1,
  //     "children_allowed": 1,
  //     "smoking": 1,
  //     "instant_booking": 1,
  //     "set_min_stay": 1,
  //     "min_stay_in_days": "2",
  //     "additional_guest_allow": 1,
  //     "max_additional_guest_allow": "2",
  //     "guest_notify_before_arrive": 1,
  //     "vaccination_allowed": null,
  //     "pro_id": 39,
  //     "guests_allowed": "1",
  //     "guest_notify_before_arrive_time": "1 Hours before",
  //     "check_in_time": "1:00-AM",
  //     "check_out_time": "1:00-AM"
  //   },
  //   step5:{user_id: 92, pro_id: "39", service_id: [2]}
  // };
  propertySession: any = {}

  openRegisterPopup = new Subject<{}>();
  openLoginPopup = new Subject<{}>();

  changeRegTypeOrRegister = new Subject<{}>();


  constructor() {
    this.loginHeader = new BehaviorSubject<boolean>(true);
    this.userDisplayName = new BehaviorSubject<string>('');
    this.userProfilePicture = new BehaviorSubject<string>('');
    this.userPerspective = new BehaviorSubject<string>(
      CONSTANTS.USER_PERSPECTIVE.NULL
    );
    this.propertySession = {}
  }

  gettoken() {
    return !!localStorage.getItem('authToken');
  }

  public get loginHeaderValue(): boolean {
    return this.loginHeader.value;
  }

  public set loginHeaderValue(status: boolean) {
    this.loginHeader.next(status);
  }

  public get userPerspectiveValue() {
    return this.userPerspective.value;
  }

  public set userPerspectiveValue(value: string) {
    this.userPerspective.next(value);
  }

  public get userDisplayNameValue() {
    return this.userDisplayName.value;
  }

  public set userDisplayNameValue(val: any) {
    this.userDisplayName.next(val);
  }

  public get userProfilePictureValue() {
    return this.userProfilePicture.value;
  }

  public set userProfilePictureValue(val: any) {
    this.userProfilePicture.next(val);
  }

  public getUserDetails() {
    if (localStorage.getItem('userdata')) {
      let userStr = localStorage.getItem('userdata') || '{}';
      let user = JSON.parse(userStr);
      return user;
    }
  }

  public getPosition(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (resp) => {
          resolve({ lng: resp.coords.longitude, lat: resp.coords.latitude });
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  public getCountries() {
    return CONSTANTS.COUNTRIES
  }





  //utillike
  isFormControlFieldInvalid(field: FormControl, error: string = '') {
    if (field.touched) {
      console.log(field);
    }
    return !field.valid && field.touched && (error ? field.hasError(error) : 1);
  }

  isFieldInvalid(field: any, form: FormGroup | any | null, error: any = null) {
    return !form.get(field).valid && form.get(field).touched && (error ? form.get(field).hasError(error) : 1);
  }
  isArrayFieldInvalid(field: string, form: FormGroup | any | null, formArray: any, index: string | number, error: any = null) {
    let formArr: FormArray | any;
    formArr = form.get(formArray) as FormArray;
    return !formArr.controls[index].get(field).valid && formArr.controls[index].get(field).touched && (error ? formArr.controls[index].get(field).hasError(error) : 1);
  }

}
