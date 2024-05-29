import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryConfirmsComponent } from './gallery-confirms.component';

describe('GalleryConfirmsComponent', () => {
  let component: GalleryConfirmsComponent;
  let fixture: ComponentFixture<GalleryConfirmsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GalleryConfirmsComponent]
    });
    fixture = TestBed.createComponent(GalleryConfirmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
