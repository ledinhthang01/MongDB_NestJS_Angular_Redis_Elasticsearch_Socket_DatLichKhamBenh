import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoMatchingComponent } from './no-matching.component';

describe('NoMatchingComponent', () => {
  let component: NoMatchingComponent;
  let fixture: ComponentFixture<NoMatchingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoMatchingComponent]
    });
    fixture = TestBed.createComponent(NoMatchingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
