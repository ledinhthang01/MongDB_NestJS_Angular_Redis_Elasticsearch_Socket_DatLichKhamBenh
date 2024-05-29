import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetaildoctorComponent } from './detaildoctor.component';

describe('DetaildoctorComponent', () => {
  let component: DetaildoctorComponent;
  let fixture: ComponentFixture<DetaildoctorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetaildoctorComponent]
    });
    fixture = TestBed.createComponent(DetaildoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
