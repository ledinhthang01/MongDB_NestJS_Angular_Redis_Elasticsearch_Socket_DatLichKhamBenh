import { Component } from '@angular/core';

@Component({
  selector: 'app-chat-employee',
  templateUrl: './chat-employee.component.html',
  styleUrls: ['./chat-employee.component.scss'],
})
export class ChatEmployeeComponent {
  dataChat!: any;
  onChatSelected(data: any) {
    this.dataChat = data;
  }
}
