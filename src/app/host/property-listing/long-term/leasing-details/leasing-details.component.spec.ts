import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeasingDetailsComponent } from './leasing-details.component';

describe('LeasingDetailsComponent', () => {
  let component: LeasingDetailsComponent;
  let fixture: ComponentFixture<LeasingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeasingDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeasingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
