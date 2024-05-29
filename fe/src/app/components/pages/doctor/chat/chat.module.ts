import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatDoctorComponent } from './general/chat-doctor.component';
import { GeneralChatModule } from '../../common/generalchat.module';

@NgModule({
  declarations: [ChatDoctorComponent],
  imports: [CommonModule, ChatRoutingModule, GeneralChatModule],
})
export class ChatModule {}
