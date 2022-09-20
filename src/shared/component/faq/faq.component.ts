import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/shared/service/api.service';
import { ApiEndpoints } from 'src/shared/utils/api-url';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
  faqRes :any ;
  faqData : any;

  constructor(
    private apiService: ApiService,
  ) {
    
   }

  ngOnInit(): void {
    this.apiService.get(environment.baseURL + ApiEndpoints.FAQ).subscribe(
      resp => {
        this.faqRes = resp;
        this.faqData = Object.values(this.faqRes.data.faq.detail)
        console.log(this.faqData);
      }
    );
}
}