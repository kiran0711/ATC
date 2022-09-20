import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatMakeUsComponent } from './what-make-us.component';

describe('WhatMakeUsComponent', () => {
  let component: WhatMakeUsComponent;
  let fixture: ComponentFixture<WhatMakeUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhatMakeUsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhatMakeUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
