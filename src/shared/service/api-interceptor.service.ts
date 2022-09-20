import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiInterceptorService implements HttpInterceptor {
  constructor() {}
  intercept(request: HttpRequest<any>, next: HttpHandler) {
    if (localStorage.getItem('authToken')) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
    }
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status !== 200 && err.status !== 422 && err.status !== 424 && err.status !== 423) {
          // this.toastr.error(err.error.message);
        }
        //console.log(err);
        return throwError(err.error);
      })
    );
  }
}
