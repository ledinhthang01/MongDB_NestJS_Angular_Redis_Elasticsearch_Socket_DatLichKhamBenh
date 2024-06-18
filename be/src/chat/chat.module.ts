import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './enity/chat.enity';
import { Users, UsersSchema } from 'src/users/enity/users.enity';
import { Message, MessageSchema } from 'src/message/enity/message.enity';
import { EventGateway } from 'src/event.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chat.name, schema: ChatSchema },
      { name: Users.name, schema: UsersSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatService, EventGateway],
})
export class ChatModule {}
