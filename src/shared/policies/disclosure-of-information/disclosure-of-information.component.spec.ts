import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisclosureOfInformationComponent } from './disclosure-of-information.component';

describe('DisclosureOfInformationComponent', () => {
  let component: DisclosureOfInformationComponent;
  let fixture: ComponentFixture<DisclosureOfInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisclosureOfInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisclosureOfInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
