import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetCancellationPolicyComponent } from './set-cancellation-policy.component';

describe('SetCancellationPolicyComponent', () => {
  let component: SetCancellationPolicyComponent;
  let fixture: ComponentFixture<SetCancellationPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetCancellationPolicyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetCancellationPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
