import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from 'src/chat/enity/chat.enity';
import { Message, MessageSchema } from './enity/message.enity';
import { EventGateway } from 'src/event.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chat.name, schema: ChatSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
  controllers: [MessageController],
  providers: [MessageService, EventGateway],
})
export class MessageModule {}
