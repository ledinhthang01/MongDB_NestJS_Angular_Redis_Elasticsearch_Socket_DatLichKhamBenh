import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { GeneralChatModule } from '../../common/generalchat.module';
import { ChatEmployeeComponent } from './general/chat-employee.component';

@NgModule({
  declarations: [ChatEmployeeComponent],
  imports: [CommonModule, ChatRoutingModule, GeneralChatModule],
})
export class ChatModule {}
