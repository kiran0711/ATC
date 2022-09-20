import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertySpaceTypeComponent } from './property-space-type.component';

describe('PropertySpaceTypeComponent', () => {
  let component: PropertySpaceTypeComponent;
  let fixture: ComponentFixture<PropertySpaceTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertySpaceTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertySpaceTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
