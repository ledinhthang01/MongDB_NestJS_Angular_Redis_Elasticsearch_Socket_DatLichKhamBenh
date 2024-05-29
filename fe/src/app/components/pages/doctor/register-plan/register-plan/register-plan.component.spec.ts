import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPlanComponent } from './register-plan.component';

describe('RegisterPlanComponent', () => {
  let component: RegisterPlanComponent;
  let fixture: ComponentFixture<RegisterPlanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterPlanComponent]
    });
    fixture = TestBed.createComponent(RegisterPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
