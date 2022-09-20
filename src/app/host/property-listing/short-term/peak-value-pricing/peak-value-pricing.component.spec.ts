import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeakValuePricingComponent } from './peak-value-pricing.component';

describe('PeakValuePricingComponent', () => {
  let component: PeakValuePricingComponent;
  let fixture: ComponentFixture<PeakValuePricingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeakValuePricingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeakValuePricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
