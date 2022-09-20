import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/shared/service/api.service';
import { SharedService } from 'src/shared/service/shared.service';
import { ApiEndpoints } from 'src/shared/utils/api-url';
import { Location } from '@angular/common';
import { PropertyService } from '../property-listing.service';
import { et } from 'date-fns/locale';
const BLANK_SEASON = {
  from: '',
  to: '',
  action: 1,
  change_price_by: 1,
  price: 0,
  bsDaterangepicker: [null, null]
};
@Component({
  selector: 'app-seasonal-pricing-management',
  templateUrl: './seasonal-pricing-management.component.html',
  styleUrls: ['./seasonal-pricing-management.component.css'],
})

export class SeasonalPricingManagementComponent implements OnInit {
  ACTION_RAISE = 1;
  ACTION_REDUCE = 2;
  CHANGE_BY_PERCENTAGE = 1;
  CHANGE_BY_AMOUNT = 2;

  peakSeasons = [JSON.parse(JSON.stringify(BLANK_SEASON))];
  moderateSeasons = [JSON.parse(JSON.stringify(BLANK_SEASON))];
  slowSeasons = [JSON.parse(JSON.stringify(BLANK_SEASON))];
  saveNExit: boolean = false;
  isEdit: boolean = false;
  currentDate: any = new Date().toISOString().slice(0, 10);
  error: any;
  pro_idd: any;
  today: Date = new Date();
  $: any;



  checkDateTimeOverlap = (dateTimes: any) => {
    let isOverlap = false;
    for (let index = 0; index < dateTimes.length - 1; index++) {
      const time = dateTimes[index];
      if (dateTimes.length > 1 && index < dateTimes.length) {
        for (let index1 = index + 1; index1 < dateTimes.length; index1++) {
          const time2 = dateTimes[index1];
          isOverlap = this.dateRangeOverlaps(
            new Date(time.from),
            new Date(time.to),
            new Date(time2.from),
            new Date(time2.to)
          );
          if (isOverlap) {
            return isOverlap;
          }
        }
      } else {
        break;
      }
    }

    return isOverlap;
  };

  dateRangeOverlaps = (a_start: any, a_end: any, b_start: any, b_end: any) => {
    if (a_start <= b_start && b_start <= a_end) return true; // b starts in a
    if (a_start <= b_end && b_end <= a_end) return true; // b ends in a
    if (b_start < a_start && a_end < b_end) return true; // a in b
    return false;
  };

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private proListingService: PropertyService,
    private propertyListingService: PropertyService
  ) { }

  async ngOnInit() {


    let pro_id = this.route.snapshot.queryParamMap.get('proId');
    if (pro_id) {
      this.isEdit = true;
      await this.proListingService.getpropertyById(pro_id);
      this.populateFeilds();
    } else {
      this.router.navigateByUrl(
        this.proListingService.CREATE_PROPERTY_STEP_ONE
      );
      return;
    }

    // =============================SUMIT=======================================

    this.pro_idd = this.activatedRoute.snapshot.queryParamMap.get('proId');
    console.log(this.pro_idd);
    if (!this.pro_idd) {
      const subscription = this.router.events.subscribe((val: any) => {
        // see also
        // console.log(val)
        this.pro_idd = this.propertyListingService.getCurrentPropertyId();
        if (
          this.pro_idd &&
          val.url == '/host/property-listing/short-term/short-term-pricing'
        ) {
          this.router.navigateByUrl(val.url + '?proId=' + this.pro_idd);
        }

        // subscription.unsubscribe()
      });
    }

    //----------------------End ------------------------------------------------
  }

  addSlowSeason() {
    if (this.slowSeasons.length < 10) {
      this.slowSeasons.push(JSON.parse(JSON.stringify(BLANK_SEASON)));
    }
  }

  addModerateSeason() {
    if (this.moderateSeasons.length < 10) {
      this.moderateSeasons.push(JSON.parse(JSON.stringify(BLANK_SEASON)));
    }
  }

  addPeakSeason() {
    if (this.peakSeasons.length < 10) {
      this.peakSeasons.push(JSON.parse(JSON.stringify(BLANK_SEASON)));
    }
  }

  removeSeason(index: any, type: any) {
    if (type == 0) {
      this.peakSeasons.splice(index, 1);
    } else if (type == 1) {
      this.moderateSeasons.splice(index, 1);
    } else if (type == 2) {
      this.slowSeasons.splice(index, 1);
    }
  }

  getNextDate(event: any, i: any, type: any) {
    let nextDate = new Date(event);
    nextDate.setDate(nextDate.getDate() + 1);
    let dateString = nextDate.toISOString().slice(0, 10);
    if (type == 1) {
      this.peakSeasons[i].to = dateString;
    } else if (type == 2) {
      this.moderateSeasons[i].to = dateString;
    } else if (type == 3) {
      this.slowSeasons[i].to = dateString;
    }
  }

  getDatePlusOne(date: string): string {
    if (!date) {
      return '';
    }
    let nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    return nextDate.toISOString().slice(0, 10);
  }

  get isValid() {
    let isvalid = true;
    if (this.peakSeasons.length) {
      this.peakSeasons.forEach((element) => {
        if (element.bsDaterangepicker[0] && !element.price) isvalid = false;
      });
    }
    if (this.moderateSeasons.length) {
      this.moderateSeasons.forEach((element) => {
        if (element.bsDaterangepicker[0] && !element.price) isvalid = false;
      });
    }
    if (this.slowSeasons.length) {
      this.slowSeasons.forEach((element) => {
        if (element.bsDaterangepicker[0] && !element.price) isvalid = false;
      });
    }

    if (this.peakSeasons.length == 1 && this.moderateSeasons.length == 1 && this.slowSeasons.length == 1) {
      if (!this.peakSeasons[0].bsDaterangepicker[0] &&
        !this.peakSeasons[0].price &&
        !this.moderateSeasons[0].bsDaterangepicker[0] &&
        !this.moderateSeasons[0].price &&
        !this.slowSeasons[0].bsDaterangepicker[0] &&
        !this.slowSeasons[0].price
      ) {
        isvalid = false;
      }
    }
    return isvalid;
  }

  saveAndExit() {
    this.saveNExit = true;
    this.saveAndNext();
  }

  saveAndNext() {
    let season1: Array<any> = [];
    let season2: Array<any> = [];
    let season3: Array<any> = [];
    this.peakSeasons.forEach((element: any) => {
      if (element.bsDaterangepicker[0] && element.bsDaterangepicker[1]) {
        element.from = element.bsDaterangepicker[0];
        element.to = element.bsDaterangepicker[1];
        season1.push(element);
      }
    });
    this.moderateSeasons.forEach((element: any) => {
      if (element.bsDaterangepicker[0] && element.bsDaterangepicker[1]) {
        element.from = element.bsDaterangepicker[0];
        element.to = element.bsDaterangepicker[1];
        season2.push(element);
      }
    });
    this.slowSeasons.forEach((element: any) => {
      if (element.bsDaterangepicker[0] && element.bsDaterangepicker[1]) {
        element.from = element.bsDaterangepicker[0];
        element.to = element.bsDaterangepicker[1];
        season3.push(element);
      }
    });

    const allSeason = season1.concat(season2, season3);
    console.log(allSeason);
    let value = this.checkDateTimeOverlap(allSeason);
    console.log(value);
    if (value) {
      this.error = 'Dates are overlapping, Please select diffrent date range';
      return;
    } else {
      this.error = null;
    }

    let reqBody = {
      user_id: this.sharedService.getUserDetails().user_id,
      pro_id: this.proListingService.getCurrentPropertyId(),
      peak_season: JSON.stringify(season1),
      moderate_season: JSON.stringify(season2),
      slow_season: JSON.stringify(season3),
    };
    console.log(reqBody);
    this.apiService
      .post(environment.baseURL + ApiEndpoints.PROPERTY_STEP6, reqBody)
      .subscribe((data: any) => {
        console.log('data', data);
        this.proListingService.property = data.data;
        let url = this.saveNExit
          ? 'host/property-list'
          : '/host/property-listing/short-term/calendar?proId=' +
          this.proListingService.getCurrentPropertyId();
        if (this.saveNExit) {
          this.proListingService.property = null;
        }
        this.router.navigateByUrl(url);
      });
  }

  skipStep() {
    let url = this.isEdit
      ? '/host/property-listing/short-term/set-cancellation-policy?proId=' +
      this.proListingService.getCurrentPropertyId()
      : '/host/property-listing/short-term/set-cancellation-policy';
    this.router.navigateByUrl(url);
  }

  populateFeilds() {
    let data = this.proListingService.property.step_six;
    if (data.peak_season.length) {
      this.peakSeasons = [];
      data.peak_season.forEach((element: any) => {
        element.from = element.from_date;
        element.to = element.to_date;
        element.bsDaterangepicker = [];
        element.bsDaterangepicker.push(new Date(element.from_date));
        element.bsDaterangepicker.push(new Date(element.to_date));
        this.peakSeasons.push(element);
      });
    }

    if (data.slow_season.length) {
      this.slowSeasons = [];
      data.slow_season.forEach((element: any) => {
        element.from = element.from_date;
        element.to = element.to_date;
        element.bsDaterangepicker = [];
        element.bsDaterangepicker.push(new Date(element.from_date));
        element.bsDaterangepicker.push(new Date(element.to_date));
        this.slowSeasons.push(element);
      });
    }

    if (data.moderate_season.length) {
      this.moderateSeasons = [];
      data.moderate_season.forEach((element: any) => {
        element.from = element.from_date;
        element.to = element.to_date;
        element.bsDaterangepicker = [];
        element.bsDaterangepicker.push(new Date(element.from_date));
        element.bsDaterangepicker.push(new Date(element.to_date));
        this.moderateSeasons.push(element);
      });
    }
  }

  back(): void {
    this.location.back();
  }

  onChangeDateRangePicker(event: any) {
    console.log(event);

  }
}
