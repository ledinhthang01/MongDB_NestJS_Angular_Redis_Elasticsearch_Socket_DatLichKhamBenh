import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FogotGalleryComponent } from './fogot-gallery.component';

describe('FogotGalleryComponent', () => {
  let component: FogotGalleryComponent;
  let fixture: ComponentFixture<FogotGalleryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FogotGalleryComponent]
    });
    fixture = TestBed.createComponent(FogotGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
