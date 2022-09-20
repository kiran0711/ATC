import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestStudentHomeComponent } from './guest-student-home.component';

describe('GuestStudentHomeComponent', () => {
  let component: GuestStudentHomeComponent;
  let fixture: ComponentFixture<GuestStudentHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuestStudentHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestStudentHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
