import { Injectable } from '@angular/core';
import { ValidatorFn } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
  })
  export class CustomToastService {
    noWhitespaceValidator: ValidatorFn;
    constructor(
      private toastr: ToastrService,
    ) {}


  showSuccess(msg:any, title:any) {
    this.toastr.success(msg, title, {
      timeOut: 1500,
      positionClass: 'toast-top-right',
      progressBar: true,
    });

  }

  showError(msg:any, title:any) {
    this.toastr.error(msg, title, {
      timeOut: 2000,
      positionClass: 'toast-top-right',
      progressBar: true,
    });
  }
  showWarning(msg:any, title:any) {
    this.toastr.warning(msg, title, {
      timeOut: 2000,
      positionClass: 'toast-top-right',
      progressBar: true,
    });
  }

  showWentWrong(error?: any) {
    this.toastr.error(error ? error : 'Something Went Wrong', 'Error', {
      timeOut: 1500,
      positionClass: 'toast-top-right',
      progressBar: true,
    });
  }

  }