import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceReviewsComponent } from './service-reviews.component';

describe('ServiceReviewsComponent', () => {
  let component: ServiceReviewsComponent;
  let fixture: ComponentFixture<ServiceReviewsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceReviewsComponent]
    });
    fixture = TestBed.createComponent(ServiceReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
