import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialListComponent } from './special-list.component';

describe('SpecialListComponent', () => {
  let component: SpecialListComponent;
  let fixture: ComponentFixture<SpecialListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpecialListComponent]
    });
    fixture = TestBed.createComponent(SpecialListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
