import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CRUDCenterComponent } from './crudcenter.component';

describe('CRUDCenterComponent', () => {
  let component: CRUDCenterComponent;
  let fixture: ComponentFixture<CRUDCenterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CRUDCenterComponent]
    });
    fixture = TestBed.createComponent(CRUDCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
