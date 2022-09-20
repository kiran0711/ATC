import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowItWorksHostComponent } from './how-it-works-host.component';

describe('HowItWorksHostComponent', () => {
  let component: HowItWorksHostComponent;
  let fixture: ComponentFixture<HowItWorksHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HowItWorksHostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HowItWorksHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
