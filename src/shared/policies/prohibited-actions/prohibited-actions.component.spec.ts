import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProhibitedActionsComponent } from './prohibited-actions.component';

describe('ProhibitedActionsComponent', () => {
  let component: ProhibitedActionsComponent;
  let fixture: ComponentFixture<ProhibitedActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProhibitedActionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProhibitedActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
