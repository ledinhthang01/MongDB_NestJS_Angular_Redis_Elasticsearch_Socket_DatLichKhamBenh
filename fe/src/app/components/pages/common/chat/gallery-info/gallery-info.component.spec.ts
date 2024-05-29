import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryInfoComponent } from './gallery-info.component';

describe('GalleryInfoComponent', () => {
  let component: GalleryInfoComponent;
  let fixture: ComponentFixture<GalleryInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GalleryInfoComponent]
    });
    fixture = TestBed.createComponent(GalleryInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
