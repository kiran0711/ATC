import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/shared/service/api.service';
import { SharedService } from 'src/shared/service/shared.service';
import { ApiEndpoints } from 'src/shared/utils/api-url';
import { Location } from '@angular/common';
import { LongTermPropertyService } from '../long-term-property-listing.service';

@Component({
  selector: 'app-amenities',
  templateUrl: './amenities.component.html',
  styleUrls: ['./amenities.component.css'],
})
export class AmenitiesComponent implements OnInit {
  amenitiesList: any;
  imageUrl = environment.imageURL;
  amenityAndFacilityForm: FormGroup;
  saveNExit: boolean = false;
  isEdit: boolean = false;
  pro_id: any;

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private apiService: ApiService,
    private fb: FormBuilder,
    private location: Location,
    private route: ActivatedRoute,
    public proListingService: LongTermPropertyService  ) {
    this.amenityAndFacilityForm = this.fb.group({
      amenityAndFacility: this.fb.array([]),
    });
  }

  async ngOnInit() {
    this.pro_id = this.route.snapshot.queryParamMap.get('proId');
    if (this.pro_id) {
      this.isEdit = true;
      await this.proListingService.getpropertyById(this.pro_id);
      if (!this.proListingService.getStepTwo()) {
        this.router.navigateByUrl(this.proListingService.CREATE_PROPERTY_STEP_THREE + "?proId=" + this.pro_id);
        return
      }
      this.populateFeilds();
    } else {
      this.router.navigateByUrl(this.proListingService.CREATE_PROPERTY_STEP_ONE);
      return;
    }

    let reqBody = {};
    let resp: any = await this.apiService.postSync(environment.baseURL + ApiEndpoints.AMENITIES, reqBody);
    this.amenitiesList = resp.data.amenities_list;
  }

  isSelected(serviceId: any) {
    const amenityAndFacility: FormArray = this.amenityAndFacilityForm.get('amenityAndFacility') as FormArray;
    let result:any = amenityAndFacility.controls.find(fc => fc.value == serviceId) != null;
    return result;
  }

  onCheckboxChange(e: any) {
    const amenityAndFacility: FormArray = this.amenityAndFacilityForm.get(
      'amenityAndFacility'
    ) as FormArray;

    if (e.target.checked) {
      amenityAndFacility.push(new FormControl(e.target.value));
    } else {
      const index = amenityAndFacility.controls.findIndex(
        (x) => x.value === e.target.value
      );

      amenityAndFacility.removeAt(index);
    }
  }

  saveAndExit() {
    this.saveNExit = true;
    this.nextStep();
  }

  nextStep() {
    let reqBody = {
      user_id: this.sharedService.getUserDetails().user_id,
      pro_id: this.proListingService.getCurrentPropertyId(),
      service_id: this.amenityAndFacilityForm.value.amenityAndFacility,
    };
    this.apiService
      .post(environment.baseURL + ApiEndpoints.longTermProperty.PROPERTY_STEP3, reqBody)
      .subscribe((data: any) => {
        this.proListingService.property = data.data;
        let url = this.saveNExit ? "host/property-list" : '/host/property-listing/long-term/upload-photos-videos?proId=' + this.proListingService.getCurrentPropertyId();
        if (this.saveNExit) {
          this.proListingService.property = null
        }
        this.router.navigateByUrl(url);
      });
  }

  back(): void {
    this.location.back();
  }

  get isValid(): boolean {
    const amenityAndFacility: FormArray = this.amenityAndFacilityForm.get(
      'amenityAndFacility'
    ) as FormArray;

    let returnValue = amenityAndFacility.value.length > 0
    return returnValue
  }

  populateEditForm(pro_id: any) {
    this.apiService.post(environment.baseURL + ApiEndpoints.PROPERTY_EDIT_STEP4, { pro_id })
      .subscribe(
        data => {
          console.log(data);
          const amenityAndFacility: FormArray = this.amenityAndFacilityForm.get(
            'amenityAndFacility'
          ) as FormArray;


          data.data.forEach((element: any) => {
            let formValue = new FormControl(element.service_id)
            amenityAndFacility.push(formValue);
          });



        },
        error => {
          console.log(error);
        }
      );
  }

  populateFeilds() {
    const amenityAndFacility: FormArray = this.amenityAndFacilityForm.get('amenityAndFacility') as FormArray;
    let data = this.proListingService.property.step_three;
    data.forEach((element: any) => {
      let formValue = new FormControl(element.service_id)
      amenityAndFacility.push(formValue);
    });
  }


}
