import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternetBasedAdvertisingComponent } from './internet-based-advertising.component';

describe('InternetBasedAdvertisingComponent', () => {
  let component: InternetBasedAdvertisingComponent;
  let fixture: ComponentFixture<InternetBasedAdvertisingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternetBasedAdvertisingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternetBasedAdvertisingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
