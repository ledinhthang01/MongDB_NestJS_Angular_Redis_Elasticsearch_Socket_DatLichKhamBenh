import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatEmployeeComponent } from './chat-employee.component';

describe('ChatEmployeeComponent', () => {
  let component: ChatEmployeeComponent;
  let fixture: ComponentFixture<ChatEmployeeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatEmployeeComponent]
    });
    fixture = TestBed.createComponent(ChatEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
