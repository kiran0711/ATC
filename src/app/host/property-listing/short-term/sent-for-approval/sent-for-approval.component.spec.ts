import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentForApprovalComponent } from './sent-for-approval.component';

describe('SentForApprovalComponent', () => {
  let component: SentForApprovalComponent;
  let fixture: ComponentFixture<SentForApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SentForApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SentForApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
