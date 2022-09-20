import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortTermPricingComponent } from './short-term-pricing.component';

describe('ShortTermPricingComponent', () => {
  let component: ShortTermPricingComponent;
  let fixture: ComponentFixture<ShortTermPricingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShortTermPricingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortTermPricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
