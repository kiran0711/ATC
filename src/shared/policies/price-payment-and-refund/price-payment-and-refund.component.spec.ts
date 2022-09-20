import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricePaymentAndRefundComponent } from './price-payment-and-refund.component';

describe('PricePaymentAndRefundComponent', () => {
  let component: PricePaymentAndRefundComponent;
  let fixture: ComponentFixture<PricePaymentAndRefundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PricePaymentAndRefundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PricePaymentAndRefundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
