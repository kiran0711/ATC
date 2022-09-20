import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescribePropertyComponent } from './describe-property.component';

describe('DescribePropertyComponent', () => {
  let component: DescribePropertyComponent;
  let fixture: ComponentFixture<DescribePropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DescribePropertyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DescribePropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
