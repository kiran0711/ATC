import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeasonalCalendarComponent } from './seasonal-calendar.component';

describe('SeasonalCalendarComponent', () => {
  let component: SeasonalCalendarComponent;
  let fixture: ComponentFixture<SeasonalCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeasonalCalendarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeasonalCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
