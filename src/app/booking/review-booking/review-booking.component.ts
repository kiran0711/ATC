import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SharedService } from 'src/shared/service/shared.service';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
  FormArray,
  AbstractControl,
} from '@angular/forms';
import { ApiEndpoints } from '../../../shared/utils/api-url';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../../shared/service/api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-review-booking',
  templateUrl: './review-booking.component.html',
  styleUrls: ['./review-booking.component.css'],
})
export class ReviewBookingComponent implements OnInit, OnDestroy {
  bookingData: any = {};
  guestDetailForm: FormGroup;
  items: FormArray;
  bookingError: any;
  //subscription: Subscription;
  // bookingRequestedId: any;

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute
  ) {
    this.guestDetailForm = this.formBuilder.group({
      primary_firstname: ['', Validators.required],
      primary_lastname: ['', Validators.required],
      primary_email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(
            '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'
          ),
        ],
      ],
      primary_phone: [
        '',
        [
          Validators.required,
          Validators.pattern('[- +()0-9]+'),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      primary_dialing_code: ['+91', Validators.required],
      vaccination: [0],
      agreed: [false, Validators.requiredTrue],
      items: this.formBuilder.array([]),
    });
  }

  ngOnInit(): void {
    //booking coming guest dashboard
    // this.subscription = this.activatedRoute.queryParams.subscribe((params: Params) => {
    //   this.bookingRequestedId = params['bookingRequestId'];
    // });


    if (!this.sharedService.bookingSession) {
      // this.router.navigateByUrl("/")
      this.sharedService.bookingSession = JSON.parse(
        localStorage.getItem('booking') || '{}'
      );
    } else {
      localStorage.setItem(
        'booking',
        JSON.stringify(this.sharedService.bookingSession)
      );
    }
    this.bookingData = this.sharedService.bookingSession;

    // console.log("hello");
    console.log(this.sharedService.bookingSession);
    for (
      let index = 0;
      index < this.bookingData.pricing.total_guest - 1;
      index++
    ) {
      // const element = this.bookingData.booking.adults[index];
      this.addItem();
    }
    // this.fields.forEach(x => {
    //   this.form.addControl(x.id, new FormControl('',Validators.required));
    // });
  }
  ngOnDestroy(): void {
    //this.subscription.unsubscribe();
  }

  get guestFormGroups() {
    return this.guestDetailForm.get('items') as FormArray;
  }

  get guestFormControl() {
    return this.guestDetailForm.controls;
  }

  getValidity(i: any, controlName: any) {
    let control = (<FormArray>this.guestDetailForm.get('items'))?.controls[
      i
    ]?.get(controlName);
    if (control == null) {
      return false;
    }
    return control.errors && control.dirty && control.touched;
  }

  getError(i: any, controlName: any) {
    let control = (<FormArray>this.guestDetailForm.get('items'))?.controls[
      i
    ]?.get(controlName);
  }

  getVaild(item: FormGroup, controlName: any) {
    return (
      item.controls[controlName].errors &&
      item.controls[controlName].dirty &&
      item.controls[controlName].touched
    );
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      is_child: false,
    });
  }

  addItem(): void {
    this.items = this.guestDetailForm.get('items') as FormArray;
    this.items.push(this.createItem());
  }

  save() {
    let reqObj = this.bookingData.booking;
    reqObj.user_id = this.sharedService.getUserDetails().user_id;
    let formdata = this.guestDetailForm.value;
    reqObj = { ...reqObj, ...formdata };
    reqObj.firstname = [];
    reqObj.lastname = [];
    reqObj.is_child = [];
    formdata.items.forEach((element: any) => {
      reqObj.firstname.push(element.firstname);
      reqObj.lastname.push(element.lastname);
      reqObj.is_child.push(element.is_child ? 1 : 0);
    });

    this.apiService
      .post(environment.baseURL + ApiEndpoints.BOOK_NOW, reqObj)
      .subscribe(
        (resp) => {
          console.log(resp);
          this.bookingError = null;
          this.sharedService.bookingSession.bookingResponse = resp.data.booking;
          this.sharedService.bookingSession.newPricing = resp.data.pricing;
          this.router.navigateByUrl('/booking/payments');
        },
        (error) => {
          this.bookingError = error.message;
          console.log(error);
        }
      );
  }
}
