import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatMakesUsSpecialComponent } from './what-makes-us-special.component';

describe('WhatMakesUsSpecialComponent', () => {
  let component: WhatMakesUsSpecialComponent;
  let fixture: ComponentFixture<WhatMakesUsSpecialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhatMakesUsSpecialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhatMakesUsSpecialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
