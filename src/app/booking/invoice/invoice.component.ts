import { Component, OnInit,ViewChild } from '@angular/core';
import {
  ActivatedRoute,
  Params,
  Router
} from '@angular/router';
import {
  ApiService
} from 'src/shared/service/api.service';
import {
  ApiEndpoints
} from 'src/shared/utils/api-url';
import * as CONSTANTS from 'src/app/app.constants';
import {
  SharedService
} from 'src/shared/service/shared.service';
import {
  environment
} from 'src/environments/environment';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { CustomToastService } from 'src/shared/service/custom-toast.service';


@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css'] 
})
export class InvoiceComponent implements OnInit {
  id:any;
  booking:any;
  map:any;
  center: any;
  infowindow:any;
  service:any;
  nearByPlaces= new Array();
  invoice:any=null;

  @ViewChild(MapInfoWindow, {static: false}) infoWindow: MapInfoWindow;
  invoiceData: any;
  invoiceType: any;
  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router:Router,
    private toastr: CustomToastService,
    private sharedService: SharedService,
  ) { 
    
    this.route.params.subscribe((params: Params) => {
      let id = params['id'];
      this.invoiceType = params['type'];

      if(!(this.invoiceType == "1" || this.invoiceType == "3")){
        this.toastr.showError('Invalid Invoice Type', 'Error');
        this.router.navigate(['/'])
      }

      this.id = id
      // this.id=atob(id);
    });
  }

  ngOnInit(): void {
    this.getInvoiceDetail();
  }

  get role() {
    let r = localStorage.getItem(CONSTANTS.ROLE);
    r = r || '';
    return r;
  }


  getInvoiceDetail(){
    this.apiService
        .post(environment.baseURL + ApiEndpoints.GET_BOOKING_INVOICE, {
          booking_id: this.id,
          user_id: this.sharedService.getUserDetails().user_id,
          user_type:this.role,
          invoice_type: this.invoiceType == 3 ? 'cancellation' : 'booking'
        })
        .subscribe(
          (data) => {
            console.log(data);
            this.invoiceData = data.data;
          },
          (error) => {
            console.log(error);
            
              this.toastr.showError('Invalid Invoice Number!', 'Error');
              this.router.navigate(['/'])
            
          }
        );
  }

  cancelBooking(){
    this.apiService
        .post(environment.baseURL + ApiEndpoints.CANCEL_BOOKING, {
          booking_id: this.id,
          user_id: this.sharedService.getUserDetails().user_id,
          user_type:this.role
        })
        .subscribe(
          (data) => {
            console.log(data);
            this.getInvoiceDetail()
          },
          (error) => {
            console.log(error)
          }
        );
  }
  
  exportPdf(url:any,downloadName:any) {
      this.apiService.download(url).subscribe((data:any) => saveAs(data, downloadName+`.pdf`));
  }
}
