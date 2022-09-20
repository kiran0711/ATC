import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, finalize } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { SearchReqModel } from 'src/app/models/reqmodels/reqSearchProperty.model';
import { CommonResDataModel } from 'src/app/models/resmodels/commonResData.model';
import { environment } from 'src/environments/environment';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  private formatErrors = (error: any): any => throwError(error);

  constructor(private http: HttpClient, private spinner: NgxSpinnerService, private _apiService:ApiService) {}
    searchPropertyUrl:string = 'general/property-list';
  getPropertList(params:SearchReqModel): Observable<CommonResDataModel> {
    /*     const reqData = new HttpParams();
        reqData.set('searchText',params.searchText);
        reqData.set('check_out',params.check_out);
        reqData.set('add_guest',params.add_guest); */
        return this._apiService.post(`${environment.baseURL+this.searchPropertyUrl}`, params)
  }

 
 
}
