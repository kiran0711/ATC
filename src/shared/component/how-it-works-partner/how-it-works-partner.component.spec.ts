import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowItWorksPartnerComponent } from './how-it-works-partner.component';

describe('HowItWorksPartnerComponent', () => {
  let component: HowItWorksPartnerComponent;
  let fixture: ComponentFixture<HowItWorksPartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HowItWorksPartnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HowItWorksPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
