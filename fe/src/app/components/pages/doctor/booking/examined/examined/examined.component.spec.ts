import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExaminedComponent } from './examined.component';

describe('ExaminedComponent', () => {
  let component: ExaminedComponent;
  let fixture: ComponentFixture<ExaminedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExaminedComponent]
    });
    fixture = TestBed.createComponent(ExaminedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
