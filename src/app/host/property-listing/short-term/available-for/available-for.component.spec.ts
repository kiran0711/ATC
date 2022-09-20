import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableForComponent } from './available-for.component';

describe('AvailableForComponent', () => {
  let component: AvailableForComponent;
  let fixture: ComponentFixture<AvailableForComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvailableForComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableForComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
