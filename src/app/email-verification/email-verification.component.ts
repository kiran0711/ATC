import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  Params
} from '@angular/router';
import { Location } from '@angular/common';
import {
  environment
} from 'src/environments/environment';
import {
  ApiService
} from 'src/shared/service/api.service';
import {
  ApiEndpoints
} from 'src/shared/utils/api-url';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css']
})
export class EmailVerificationComponent implements OnInit {

  validationType:any
  constructor(private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private location: Location) { 
    this.route.url.subscribe((params: any) => {
      let type = params[0].path;
      switch (type) {
        case "verification-success":
          this.validationType="success"
          break;
        case "verification-failed":
          this.validationType="failed"
          break;
        default:
          this.validationType=null
          break;
      }
      if(!this.validationType){
        this.router.navigateByUrl("/");
      }
    });
  }

  ngOnInit(): void {
  }

}
