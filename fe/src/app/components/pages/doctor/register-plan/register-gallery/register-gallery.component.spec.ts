import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterGalleryComponent } from './register-gallery.component';

describe('RegisterGalleryComponent', () => {
  let component: RegisterGalleryComponent;
  let fixture: ComponentFixture<RegisterGalleryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterGalleryComponent]
    });
    fixture = TestBed.createComponent(RegisterGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
