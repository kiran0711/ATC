import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LongTermDetailViewComponent } from './long-term-detail-view.component';

describe('LongTermDetailViewComponent', () => {
  let component: LongTermDetailViewComponent;
  let fixture: ComponentFixture<LongTermDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LongTermDetailViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LongTermDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
