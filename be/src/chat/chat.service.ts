import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chat } from './enity/chat.enity';
import { Model, Types } from 'mongoose';
import { AccessChatDTO } from './dto/accessChat.dto';
import { ServerError } from 'src/utils/exception';
import { Users } from 'src/users/enity/users.enity';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
    @InjectModel(Users.name) private usersModel: Model<Users>,
  ) {}

  async accessChat(accessChatDTO: AccessChatDTO, user: any): Promise<any> {
    const userId = new Types.ObjectId(accessChatDTO.userId);
    var isChat: any = await this.chatModel
      .find({
        isGroupChat: false,
        $and: [
          { users: { $elemMatch: { $eq: user._id } } },
          { users: { $elemMatch: { $eq: userId } } },
        ],
      })
      .populate({
        path: 'users',
        model: 'Users',
        select: '_id name email avatar',
      })
      .populate({
        path: 'latestMessage',
        model: 'Message',
      });

    if (isChat.length > 0) {
      return isChat[0];
    } else {
      isChat = {
        chatName: 'sender',
        isGroupChat: false,
        users: [user._id, userId],
      };

      const createdChat = await this.chatModel.create(isChat);
      const fullChat = await this.chatModel
        .findOne({ _id: createdChat._id })
        .populate({
          path: 'users',
          model: 'Users',
          select: '_id name email avatar',
        });

      if (!fullChat) {
        throw new ServerError('Error from accessChat!');
      }

      return fullChat;
    }
  }

  async fetchChats(id: Types.ObjectId): Promise<any> {
    const results = await this.chatModel
      .find({
        users: { $eq: id },
      })
      .populate({
        path: 'users',
        model: 'Users',
        select: '_id name email avatar',
      })
      .populate({
        path: 'groupAdmin',
        model: 'Users',
        select: '_id name email avatar',
      })
      .populate({
        path: 'latestMessage',
        model: 'Message',
      })
      .sort({ updatedAt: -1 });

    const data = await this.usersModel.populate(results, {
      path: 'latestMessage.sender',
      model: 'Users',
      select: '_id name email avatar',
    });
    if (!data) {
      throw new ServerError('Error from fetchChats!');
    }
    return data;
  }

  async createGroupChat(): Promise<any> {}
}
