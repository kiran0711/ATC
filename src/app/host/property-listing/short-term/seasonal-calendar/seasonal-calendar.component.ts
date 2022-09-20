import {
  Component,
  OnInit
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameMonth,
} from 'date-fns';
import { Subject } from 'rxjs';
import {
  CalendarEvent,
  CalendarDateFormatter,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/shared/service/api.service';
import { SharedService } from 'src/shared/service/shared.service';
import { ApiEndpoints } from 'src/shared/utils/api-url';
import { Location } from '@angular/common';
import { CustomDateFormatter } from './custom-dateformat';
import { PropertyService } from '../property-listing.service';
import { el } from 'date-fns/locale';
import { DatePipe } from '@angular/common';


const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
  green: {
    primary: '#777777',
    secondary: '#777777',
  },
};

@Component({
  selector: 'app-seasonal-calendar',
  templateUrl: './seasonal-calendar.component.html',
  styleUrls: ['./seasonal-calendar.component.css'],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
  ],
})
export class SeasonalCalendarComponent implements OnInit {
  view: CalendarView = CalendarView.Month;
  today = new Date();
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  days: Array<any> = []
  datesAvailable:Boolean=false;
  notAvailableDate:any;
  modalData: {
    action: string;
    event: CalendarEvent;
  };

  refresh = new Subject<void>();

  events: CalendarEvent[] = [
  ];

  PEAK_SEASON_TEMPLETE: any = {
    start: subDays(startOfDay(new Date()), 1),
    end: addDays(new Date(), 1),
    title: 'Peak Season',
    color: colors.red,
    allDay: true,
  }

  MODERATE_SEASON_TEMPLETE: any = {
    start: subDays(startOfDay(new Date()), 1),
    end: addDays(new Date(), 1),
    title: 'Moderate Season',
    color: colors.yellow,
    allDay: true,
  }

  SLOW_SEASON_TEMPLETE: any = {
    start: subDays(endOfMonth(new Date()), 3),
    end: addDays(endOfMonth(new Date()), 3),
    title: 'Slow Season',
    color: colors.blue,
    allDay: true,
  }

  DRAGABLE_SEASON_TEMPLETE: any = {
    start: null,
    end: null,
    title: 'Not Available Booking',
    color: colors.green,
    allDay: true,
  }

  activeDayIsOpen: boolean = false;
  saveNExit: boolean = false;
  isEdit: boolean = false;
  pro_idd:any;

  constructor(private router: Router,
    private sharedService: SharedService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    public proListingService: PropertyService,
    private propertyListingService:PropertyService,
    private datePipe: DatePipe) { }

  async ngOnInit() {
    let pro_id = this.route.snapshot.queryParamMap.get('proId');
    if (pro_id) {
      this.isEdit = true;
      await this.proListingService.getpropertyById(pro_id);
      this.populateFeilds();
    } else {
      this.router.navigateByUrl(this.proListingService.CREATE_PROPERTY_STEP_ONE);
      return;
    }


    // =============================SUMIT=======================================

this.pro_idd = this.activatedRoute.snapshot.queryParamMap.get('proId');
console.log(this.pro_idd) 
if(!this.pro_idd){
  const subscription = this.router.events.subscribe((val:any) => {
    // see also 
    // console.log(val) 
    this.pro_idd = this.propertyListingService.getCurrentPropertyId()
    if(this.pro_idd && val.url=='/host/property-listing/short-term/seasonal-pricing'){
      this.router.navigateByUrl(val.url+"?proId="+this.pro_idd);
    }

    // subscription.unsubscribe()
});
}


//----------------------End ------------------------------------------------
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      // if (
      //   (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0
      // ) {
      //   this.activeDayIsOpen = false;
      // } else {
      //   this.activeDayIsOpen = true;
      // }
      this.viewDate = date;

      // if(this.DRAGABLE_SEASON_TEMPLETE.start && this.DRAGABLE_SEASON_TEMPLETE.end){
      //   this.DRAGABLE_SEASON_TEMPLETE.start=null
      //   this.DRAGABLE_SEASON_TEMPLETE.end=null
      //   this.events=this.events.filter((x)=>(x.title!=this.DRAGABLE_SEASON_TEMPLETE.title))
      // }else if(!this.DRAGABLE_SEASON_TEMPLETE.start){
      //   this.DRAGABLE_SEASON_TEMPLETE.start=date
      //   this.events.push(this.DRAGABLE_SEASON_TEMPLETE)
      // }else if(!this.DRAGABLE_SEASON_TEMPLETE.end){
      //   this.DRAGABLE_SEASON_TEMPLETE.end=date
      //   this.events=this.events.filter((x)=>(x.title!=this.DRAGABLE_SEASON_TEMPLETE.title))
      //   this.events.push(this.DRAGABLE_SEASON_TEMPLETE)
      // }
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {

  }

  addDays(): void {
    let day = JSON.parse(JSON.stringify(this.DRAGABLE_SEASON_TEMPLETE));
    this.days.push(day);
  }

  getDatePlusOne(date: string): string {
    if (!date) {
      return ""
    }
    let nextDate = new Date(date)
    nextDate.setDate(nextDate.getDate() + 1)
    return nextDate.toISOString().slice(0, 10)
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  onEndDateChanged() {
    this.events = this.events.filter((event) => event.title !== this.DRAGABLE_SEASON_TEMPLETE.title);
    this.events = this.events.concat(this.days)
  }

  skipStep() {
    let url = '/host/property-listing/short-term/set-cancellation-policy?proId=' + this.proListingService.getCurrentPropertyId();
    this.router.navigateByUrl(url);
  }

  back(): void {
    this.location.back();
  }

  onDateChanged(event: any,day: any){
    console.log(event)
    day.start = this.datePipe.transform(event[0], 'yyyy-MM-dd')
    day.end = this.datePipe.transform(event[0], 'yyyy-MM-dd')
    this.onEndDateChanged()
  }

  // onDateChanged(event: any, day: any, type: any) {
  //   if (type == 0) {
  //     day.start = new Date(event.target.value)
  //     day.end = new Date(event.target.value)
  //   } else {
  //     day.end = new Date(event.target.value)

  //   }
  //   this.onEndDateChanged()
  // }

  removeEvent(index: any) {
    let day = this.days[index]
    this.events = this.events.filter((event) => !(event.title == this.DRAGABLE_SEASON_TEMPLETE.title && event.start == day.start && event.end == day.end))
    this.days.splice(index, 1);
  }

  next() {
    let days=[]
    if(this.datesAvailable){
      days=this.days
    }
    let reqBody = {
      dates: JSON.stringify(days.map(day => { return { from_date: this.datePipe.transform(day.start, 'yyyy-MM-dd'), to_date: this.datePipe.transform(day.end, 'yyyy-MM-dd') }; })),
      pro_id: this.proListingService.getCurrentPropertyId()
    };
    console.log(reqBody);
    this.apiService
      .post(environment.baseURL + ApiEndpoints.SAVE_AVAILABILITY, reqBody)
      .subscribe((data: any) => {
        console.log('data', data);
        this.proListingService.property = data.data;
        let url = '/host/property-listing/short-term/set-cancellation-policy?proId=' + this.proListingService.getCurrentPropertyId();
        if (this.saveNExit) {
          this.proListingService.property = null
        }
        this.router.navigateByUrl(url);
      });
  }

  populateFeilds() {
    let data = this.proListingService.property.property_unavailable_dates;
    this.days = [];
    if (!data || data.length == 0) {
      this.datesAvailable=false;
      this.days.push(JSON.parse(JSON.stringify(this.DRAGABLE_SEASON_TEMPLETE)));
    } else {
      this.datesAvailable=true;
      data.forEach((d: any) => {
        this.days.push({
          start: new Date(d.from_date),
          end: new Date(d.to_date),
          title: this.DRAGABLE_SEASON_TEMPLETE.title,
          color: colors.green,
          allDay: true,
          startAndEnd:[new Date(d.from_date),new Date(d.to_date)]
        });
      });
    }
    let step_six_data=this.proListingService.property.step_six
    if(step_six_data.peak_season.length){
      step_six_data.peak_season.forEach((element:any) => {
        element.from=element.from_date
        element.to=element.to_date
        let season=JSON.parse(JSON.stringify(this.PEAK_SEASON_TEMPLETE))
        season.start=new Date(element.from)
        season.end=new Date(element.to)
        this.events.push(season)
      });
    }

    if(step_six_data.slow_season.length){  
      step_six_data.slow_season.forEach((element:any) => {
        element.from=element.from_date
        element.to=element.to_date
        let season=JSON.parse(JSON.stringify(this.SLOW_SEASON_TEMPLETE))
        season.start=new Date(element.from)
        season.end=new Date(element.to)
        this.events.push(season)
      });
    }  

    if(step_six_data.moderate_season.length){
      step_six_data.moderate_season.forEach((element:any) => {
        element.from=element.from_date
        element.to=element.to_date
        let season=JSON.parse(JSON.stringify(this.MODERATE_SEASON_TEMPLETE))
        season.start=new Date(element.from)
        season.end=new Date(element.to)
        this.events.push(season)
      });
    }

    this.refresh.next();

    this.onEndDateChanged();
    console.log(this.days);
  }

  onAvailablityChange(event:any){
    console.log(event)
  }

}
