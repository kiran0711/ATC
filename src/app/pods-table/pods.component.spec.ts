import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingListTableComponent } from './booking-list-table.component';

describe('BookingListTableComponent', () => {
  let component: BookingListTableComponent;
  let fixture: ComponentFixture<BookingListTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingListTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingListTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
