import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovtIdComponent } from './govt-id.component';

describe('GovtIdComponent', () => {
  let component: GovtIdComponent;
  let fixture: ComponentFixture<GovtIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GovtIdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GovtIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
