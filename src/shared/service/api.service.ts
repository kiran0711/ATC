import { HttpClient, HttpParams, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, finalize, map, tap, last } from 'rxjs/operators';
import { Observable, Subject, throwError } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpEventType } from '@angular/common/http';
import { API_KEY } from 'src/app/app.constants';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private formatErrors = (error: any): any => throwError(error);
  private dataTransferSubject = new Subject<string>()
  constructor(private http: HttpClient, private spinner: NgxSpinnerService) { }


  dataTransferObservable = this.dataTransferSubject.asObservable();

  push(str: string) {
    this.dataTransferSubject.next(str);
  }

  get(url: string, params?: HttpParams): Observable<any> {
    return this.http.get(`${url}`, { params }).pipe(
      catchError(this.formatErrors),
      finalize(() => { })
    );
  }

  post(url: string, body: any, is_true: boolean = true): Observable<any> {
    if (is_true)
      this.spinner.show();
    return this.http.post(`${url}`, body).pipe(
      catchError(this.formatErrors),
      finalize(() => {
        this.spinner.hide();
      })
    );
  }

  async postPromise(url: string, body: any, is_true: boolean = true) {
    if (is_true){
      this.spinner.show();
    }
    const res = await this.http.post(`${url}`, body).toPromise();
    this.spinner.hide();
    return res;
  }

  uploadImage(url: string, body: any, options: any, file: File): Observable<any> {
    return this.http.post(`${url}`, body, options).pipe(
      map((event: any) => this.getEventMessage(event, file)),
      catchError(this.formatErrors)
    );
  }

  private getEventMessage(event: HttpEvent<any>, file: File) {
    let data: any = event
    data.file_name = file.name
    return data
  }

  async postSync(url: string, body: any) {
    this.spinner.show();
    let httpResp;
    await this.http.post(`${url}`, body).pipe(
      catchError(this.formatErrors),
      finalize(() => {
        this.spinner.hide();
      })
    ).toPromise().then((d: any) => { httpResp = d; });
    return httpResp;
  }

  async getSync(url: string) {
    this.spinner.show();
    let httpResp;
    await this.http.get(`${url}`).pipe(
      catchError(this.formatErrors),
      finalize(() => {
        this.spinner.hide();
      })
    ).toPromise().then((d: any) => { httpResp = d; });
    return httpResp;
  }


  public getNearByLocations(params: any) {
    let API_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
    const reqData = new HttpParams();
    reqData.set('location', params.location);
    reqData.set('radius', params.radius);
    reqData.set('keyword', params.keyword);
    reqData.set('key', API_KEY);
    return this.get(API_URL, reqData);

  }

  download(url: string): Observable<Blob> {
    return this.http.get(url,
      {
        responseType: 'blob', headers: {
          'Accept': 'application/pdf',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
          'Content-Type': 'application/json'
        }
      });
  }

  public showSpinner() {
    this.spinner.show()
  }

  public hideSpinner() {
    this.spinner.hide()
  }

  inverseSlugify(s: string) {
    return s.toLowerCase()
      .split('-')
      .map(i => i[0].toUpperCase() + i.substr(1))
      .join(' ');
  }
  //location=-33.8670522%2C151.1957362&radius=1000&keyword=cruise&key=AIzaSyCZrIUBGN0aJOY6pRWnpkgISJ5bFMaKDwE

}
