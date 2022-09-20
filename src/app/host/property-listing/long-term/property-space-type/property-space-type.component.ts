import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/shared/service/api.service';
import { SharedService } from 'src/shared/service/shared.service';
import { ApiEndpoints } from 'src/shared/utils/api-url';
import { LongTermPropertyService } from '../long-term-property-listing.service';

@Component({
  selector: 'app-property-space-type',
  templateUrl: './property-space-type.component.html',
  styleUrls: ['./property-space-type.component.css'],
})

export class PropertySpaceTypeComponent implements OnInit {
  propertySpaceTypeForm: FormGroup;
  typeOfSpace: any;
  typeOfProperty: any;
  imageUrl = environment.imageURL;
  saveNExit: boolean = false;
  isEdit: boolean = false;
  pro_id: string | null;

  constructor(
    private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    public proListingService: LongTermPropertyService) {

    this.propertySpaceTypeForm = this.formBuilder.group({
      available_for: [1, [Validators.required]],
      category_id: ['', [Validators.required]],
      property_type_id: ['', [Validators.required]]
    });
  }

  async ngOnInit() {
    let resp: any = await this.apiService.postSync(environment.baseURL + ApiEndpoints.GET_PROPERTY_TYPES, {});
    this.typeOfSpace = resp.data.type_of_space;
    this.typeOfProperty = resp.data.property_type;

    this.pro_id = this.route.snapshot.queryParamMap.get('proId');
    if (this.pro_id) {
      this.isEdit = true;
      await this.proListingService.getpropertyById(this.pro_id);
      this.populateFeilds();
    } else {
      this.router.navigateByUrl(this.proListingService.CREATE_PROPERTY_STEP_ONE);
      return;
    }
  }

  get propertyInfoFormControl() {
    return this.propertySpaceTypeForm.controls;
  }

  saveAndExit() {
    this.saveNExit = true;
    this.next();
  }

  next() {
    let proStepZero = this.proListingService.property.step_zero;
    const reqBody = {
      user_id: this.sharedService.getUserDetails().user_id,
      pro_id: proStepZero.pro_id,
      available_for: 1,
      category_id: this.propertySpaceTypeForm.value.category_id,
      property_type_id: this.propertySpaceTypeForm.value.property_type_id
    };
    this.apiService.post(environment.baseURL + ApiEndpoints.longTermProperty.PROPERTY_STEP1, reqBody).subscribe((data: any) => {
      this.proListingService.property = data.data;
      if (this.saveNExit) {
        this.proListingService.property = null
      }
      this.router.navigateByUrl(this.saveNExit ? "host/property-list" : '/host/property-listing/long-term/describe-property?proId=' + this.proListingService.property.step_one.pro_id);
    });
  }

  populateFeilds() {
    let data = this.proListingService.property.step_one;
    if (Array.isArray(data)) {
      return
    }
    this.propertySpaceTypeForm.setValue({
      available_for: data.available_for,
      category_id: data.category_id ? data.category_id : '',
      property_type_id: data.property_type_id == null ? '' : data.property_type_id
    });
  }
}
