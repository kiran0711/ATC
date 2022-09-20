import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyListingCreateComponent } from './property-listing-create.component';

describe('PropertyListingCreateComponent', () => {
  let component: PropertyListingCreateComponent;
  let fixture: ComponentFixture<PropertyListingCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyListingCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyListingCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
