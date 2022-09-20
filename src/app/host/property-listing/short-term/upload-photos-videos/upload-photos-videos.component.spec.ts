import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPhotosVideosComponent } from './upload-photos-videos.component';

describe('UploadPhotosVideosComponent', () => {
  let component: UploadPhotosVideosComponent;
  let fixture: ComponentFixture<UploadPhotosVideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadPhotosVideosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadPhotosVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
