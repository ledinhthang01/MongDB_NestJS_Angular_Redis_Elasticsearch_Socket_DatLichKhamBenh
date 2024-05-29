import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleMedicalExaminationComponent } from './schedule-medical-examination.component';

describe('ScheduleMedicalExaminationComponent', () => {
  let component: ScheduleMedicalExaminationComponent;
  let fixture: ComponentFixture<ScheduleMedicalExaminationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScheduleMedicalExaminationComponent]
    });
    fixture = TestBed.createComponent(ScheduleMedicalExaminationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
