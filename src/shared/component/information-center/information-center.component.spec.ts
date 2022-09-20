import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationCenterComponent } from './information-center.component';

describe('InformationCenterComponent', () => {
  let component: InformationCenterComponent;
  let fixture: ComponentFixture<InformationCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformationCenterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
