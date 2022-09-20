import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeasonalPricingManagementComponent } from './seasonal-pricing-management.component';

describe('SeasonalPricingManagementComponent', () => {
  let component: SeasonalPricingManagementComponent;
  let fixture: ComponentFixture<SeasonalPricingManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeasonalPricingManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeasonalPricingManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
