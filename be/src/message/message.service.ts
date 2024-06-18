import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './enity/message.enity';
import { Model, Types } from 'mongoose';
import { ServerError, XNotFound } from 'src/utils/exception';
import { SendMessageDTO } from './dto/sendMessage.dto';
import { Chat } from 'src/chat/enity/chat.enity';
import { EditMessageDTO } from './dto/editMessage.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
  ) {}

  async getAllMessages(query: any): Promise<any> {
    let { page, size, id } = query;
    page = parseInt(page);
    size = parseInt(size);

    const messages = await this.messageModel
      .find({ chat: new Types.ObjectId(id) })
      .populate({
        path: 'sender',
        model: 'Users',
        select: '_id name email avatar',
      })
      .populate({
        path: 'chat',
        model: 'Chat',
        select: '_id chatName users groupAdmin',
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * size)
      .limit(size);

    if (!messages) {
      throw new ServerError('Something went wrong!');
    }
    return messages;
  }

  async sendMessage(
    sendMessageDTO: SendMessageDTO,
    _id: Types.ObjectId,
  ): Promise<any> {
    const newMessage = {
      sender: _id,
      content: sendMessageDTO.content,
      chat: new Types.ObjectId(sendMessageDTO.chatId),
    };

    const message = await this.messageModel.create(newMessage);

    const data = (
      await message.populate({
        path: 'sender',
        model: 'Users',
        select: '_id name email avatar',
      })
    ).populate({
      path: 'chat',
      model: 'Chat',
      select: '_id chatName isGroupChat users groupAdmin',
    });

    if (!message) {
      throw new ServerError('Something went wrong!');
    }

    await this.chatModel.findByIdAndUpdate(sendMessageDTO.chatId, {
      latestMessage: message._id,
    });

    return data;
  }

  async editMessage(
    editMessageDTO: EditMessageDTO,
    _id: Types.ObjectId,
  ): Promise<any> {
    const message = await this.messageModel.findById(editMessageDTO.messageId);
    if (!message) {
      throw new XNotFound('Message');
    }

    if (message['sender'].toString() !== _id.toString()) {
      throw new ServerError('You cannot edit this message!');
    }

    const createAt: Date = new Date(message['createdAt']);
    const now: Date = new Date();

    const time: number = now.getTime() - createAt.getTime();
    const thirtyMinutesMs: number = 30 * 60 * 1000;

    if (time > thirtyMinutesMs) {
      throw new ServerError("It's past time to edit!");
    } else {
      const data = await this.messageModel.findByIdAndUpdate(
        editMessageDTO.messageId,
        { content: editMessageDTO.content, status: 'edit' },
        { new: true },
      );
      if (!data) {
        throw new ServerError('Something went wrong!');
      }
      return data;
    }
  }

  async deleteMessage(idMessage: string, _id: Types.ObjectId): Promise<any> {
    const message = await this.messageModel.findById(idMessage);
    if (!message) {
      throw new XNotFound('Message');
    }

    if (message['sender'].toString() !== _id.toString()) {
      throw new ServerError('You cannot delete this message!');
    }

    const createAt: Date = new Date(message['createdAt']);
    const now: Date = new Date();

    const time: number = now.getTime() - createAt.getTime();
    const thirtyMinutesMs: number = 30 * 60 * 1000;

    if (time > thirtyMinutesMs) {
      throw new ServerError("It's past time to delete!");
    } else {
      const data = await this.messageModel.findByIdAndUpdate(
        idMessage,
        {
          content: '',
          status: 'delete',
        },
        { new: true },
      );
      if (!data) {
        throw new ServerError('Something went wrong!');
      }
      return data;
    }
  }
}
