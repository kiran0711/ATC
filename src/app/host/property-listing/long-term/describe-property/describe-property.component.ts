import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/shared/service/api.service';
import { SharedService } from 'src/shared/service/shared.service';
import { ApiEndpoints } from 'src/shared/utils/api-url';
import { LongTermPropertyService } from '../long-term-property-listing.service';

@Component({
  selector: 'app-describe-property',
  templateUrl: './describe-property.component.html',
  styleUrls: ['./describe-property.component.css'],
})
export class DescribePropertyComponent implements OnInit {

  attributes: any = [];
  intialVal: boolean = false;
  attributeValue = 0;
  describePropertyForm: FormGroup;
  currentLength = 0;
  saveNExit: boolean = false;
  isEdit: boolean = false;
  pro_id: string | null;
  utilityItems: any = [];

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private apiService: ApiService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public proListingService: LongTermPropertyService) {
    this.describePropertyForm = this.fb.group({
      property_description: ['', [Validators.minLength(100), Validators.maxLength(2000), Validators.required]],
    });
  }
  async ngOnInit() {

    this.pro_id = this.route.snapshot.queryParamMap.get('proId');
    if (this.pro_id) {
      this.isEdit = true;
      await this.proListingService.getpropertyById(this.pro_id);
      if (!this.proListingService.getCurrentPropertyCategory()) {
        let url = this.pro_id ? this.proListingService.CREATE_PROPERTY_STEP_TWO + "?proId=" + this.pro_id : this.proListingService.CREATE_PROPERTY_STEP_TWO
        this.router.navigateByUrl(url);
        return
      }
      let req = { category_id: this.proListingService.property.step_one.category_id, property_term: 1 };
      let resp: any = await this.apiService.postSync(environment.baseURL + ApiEndpoints.ATTRIBUTES_LIST, req);
      this.attributes = resp.data.discribe_your_property;
      let utility_items = this.attributes.find((att: any) => att.attr_key == 'utility_items').option1.split(',');
      utility_items.forEach((element: any) => {
        this.utilityItems.push({ name: element, value: false })
      });
      this.initDescribeForm();
      this.populateFeilds();
    } else {
      this.router.navigateByUrl(this.proListingService.CREATE_PROPERTY_STEP_ONE);
      return;
    }
  }
  initDescribeForm() {
    this.attributes.forEach((attribute: any) => {
      if (attribute.input_type == 'checkbox') {
        this.describePropertyForm.addControl(attribute['attr_key'], new FormControl([]));
      }
      else {
        this.describePropertyForm.addControl(attribute['attr_key'], new FormControl(attribute['min_val']));
      }
    });
    this.describePropertyForm.get('property_description')?.valueChanges.subscribe((val) => { this.currentLength = val.length });
  }
  populateFeilds() {
    let data = this.proListingService.property.step_two;
    this.attributes.forEach((attr: any) => {
      let attrName = attr['attr_key'] ? attr['attr_key'] : '';
      let attrKey = attrName.toLowerCase().replace(' ', '_');
      let value = data[attrKey];
      if (attr.input_type == 'checkbox') {
        let utility_selected_items = value ? value : [];
        utility_selected_items.forEach((element: any) => {
          this.utilityItems.forEach((ele: any) => {
            if (ele.name == element) {
              ele.value = true;
            }
          });
        });
        value = this.utilityItems;
      }
      else {
        value = value ? value : (attr['min_val'] ? attr['min_val'] : 0)
      }
      this.describePropertyForm.controls[attrName].setValue(value);
    });
    if (data['property_description'])
      this.describePropertyForm.controls['property_description'].setValue(data['property_description']);
  }


  decrease(minVal: any, setAttrName: string) {
    let decrement = setAttrName.toLocaleLowerCase() == 'baths' ? 0.5 : 1;
    if (this.describePropertyForm.controls[setAttrName].value > minVal) {
      this.describePropertyForm.controls[setAttrName].setValue(this.describePropertyForm.value[setAttrName] -= decrement);
    }
  }
  increase(maxVal: any, setAttrName: string) {
    let increment = setAttrName.toLocaleLowerCase() == 'baths' ? 0.5 : 1;
    if (this.describePropertyForm.controls[setAttrName].value < maxVal) {
      this.describePropertyForm.controls[setAttrName].setValue(this.describePropertyForm.value[setAttrName] += increment);
    }
  }
  onCheckChange(event: any, item: any) {
    this.propertyDescribeFormControl.utility_items.value.forEach((element: any) => {
      if (element.name == item.name) {
        element.value = event.target.checked;
      }
    });
  }


  saveAndExit() {
    this.saveNExit = true;
    this.next();
  }
  next() {
    const formData: any = this.describePropertyForm.value;
    formData.user_id = this.sharedService.getUserDetails().user_id;
    formData.pro_id = this.proListingService.getCurrentPropertyId();
    let utility_items_checked = this.describePropertyForm.controls.utility_items.value.filter((item: { value: boolean; }) => item.value == true)
    if (utility_items_checked.length > 0) {
      formData.utility_items = utility_items_checked.map((u: any) => u.name);
    }


    for (const key in formData) {
      if (Object.prototype.hasOwnProperty.call(formData, key)) {
        if (formData[key] === true) {
          formData[key] = 1
        }
        else if (formData[key] === false) {
          formData[key] = 0
        }
      }
    }




    // let reqArray: any = [];
    // for (const property in this.describePropertyForm.value) {
    //   reqArray.push({
    //     [property.toLowerCase().replace(' ', '_')]:
    //       this.describePropertyForm.value[property],
    //   });
    // }
    // reqArray.push({ user_id: this.sharedService.getUserDetails().user_id });
    // reqArray.push({ pro_id: this.proListingService.getCurrentPropertyId() });

    // let result: any = {};
    // for (let i = 0; i < reqArray.length; i++) {
    //   result[Object.keys(reqArray[i])[0]] = reqArray[i][Object.keys(reqArray[i])[0]];
    // }

    this.apiService.post(environment.baseURL + ApiEndpoints.longTermProperty.PROPERTY_STEP2, formData).subscribe((data: any) => {
      this.proListingService.property = data.data;
      if (this.saveNExit) {
        this.proListingService.property = null
      }
      this.router.navigateByUrl(this.saveNExit ? "host/property-list" : '/host/property-listing/long-term/amenities?proId=' + this.proListingService.getCurrentPropertyId());
    });
  }

  get propertyDescribeFormControl() {
    return this.describePropertyForm.controls;
  }
}
