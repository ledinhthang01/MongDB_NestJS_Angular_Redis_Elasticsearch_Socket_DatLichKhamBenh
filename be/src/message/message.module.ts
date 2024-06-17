import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from 'src/chat/enity/chat.enity';
import { Message, MessageSchema } from './enity/message.enity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chat.name, schema: ChatSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
