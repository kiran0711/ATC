import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LongTermPricingComponent } from './long-term-pricing.component';

describe('LongTermPricingComponent', () => {
  let component: LongTermPricingComponent;
  let fixture: ComponentFixture<LongTermPricingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LongTermPricingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LongTermPricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
