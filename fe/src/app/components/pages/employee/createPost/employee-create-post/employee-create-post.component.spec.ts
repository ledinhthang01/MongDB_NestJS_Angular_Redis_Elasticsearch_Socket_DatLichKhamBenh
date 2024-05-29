import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeCreatePostComponent } from './employee-create-post.component';

describe('EmployeeCreatePostComponent', () => {
  let component: EmployeeCreatePostComponent;
  let fixture: ComponentFixture<EmployeeCreatePostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeCreatePostComponent]
    });
    fixture = TestBed.createComponent(EmployeeCreatePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
