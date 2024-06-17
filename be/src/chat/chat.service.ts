import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chat } from './enity/chat.enity';
import { Model, ObjectId, Types } from 'mongoose';
import { AccessChatDTO } from './dto/accessChat.dto';
import { ServerError, XAlreadyExists, XNotFound } from 'src/utils/exception';
import { Users } from 'src/users/enity/users.enity';
import { CreateGroupChat } from './dto/createGroupChat.dto';
import { RenameGroupDTO } from './dto/reNameGroup.dto';
import { GroupChatDTO } from './dto/removeMember.dto';
import { Message } from 'src/message/enity/message.enity';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
    @InjectModel(Users.name) private usersModel: Model<Users>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
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
        groupAdmin: user._id,
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

  async createGroupChat(
    createGroupChat: CreateGroupChat,
    user: any,
  ): Promise<any> {
    createGroupChat.users = createGroupChat.users.map(
      (item) => new Types.ObjectId(item),
    );

    if (createGroupChat.users.length < 2) {
      throw new ServerError(
        'More than 2 users are required to form a group chat!',
      );
    }

    createGroupChat.users.push(user['_id']);

    createGroupChat.groupAdmin = user;
    createGroupChat.isGroupChat = true;

    const groupChat = await this.chatModel.create(createGroupChat);

    const fullGroupChat = await this.chatModel
      .findOne({ _id: groupChat._id })
      .populate({
        path: 'users',
        model: 'Users',
        select: '_id name email avatar',
      })
      .populate({
        path: 'groupAdmin',
        model: 'Users',
        select: '_id name email avatar',
      });

    if (!fullGroupChat) {
      throw new ServerError('Create group chat!');
    }
    return fullGroupChat;
  }

  async renameGroup(
    renameGroupDTO: RenameGroupDTO,
    _id: Types.ObjectId,
  ): Promise<any> {
    const groupChat = await this.chatModel.findById(renameGroupDTO.chatId);

    if (!groupChat) {
      throw new XNotFound('Group chat');
    }

    if (_id.toString() !== groupChat.groupAdmin._id.toString()) {
      throw new ServerError('You do not have access!');
    }

    const updateChat = await this.chatModel.findByIdAndUpdate(
      renameGroupDTO.chatId,
      { chatName: renameGroupDTO.chatName },
      { new: true },
    );

    if (!updateChat) {
      throw new ServerError('Somethinf went wrong');
    }
    return updateChat.chatName;
  }

  async addMemberToGroup(groupChatDTO: GroupChatDTO): Promise<any> {
    const chat = await this.chatModel.findById(groupChatDTO.chatId);
    if (!chat) {
      throw new XNotFound('Group chat');
    }

    const existingUser = chat.users.find(
      (user: any) => user.toString() === groupChatDTO.userId.toString(),
    );
    if (existingUser) {
      throw new XAlreadyExists('User');
    }

    const added = await this.chatModel
      .findByIdAndUpdate(
        groupChatDTO.chatId,
        { $push: { users: new Types.ObjectId(groupChatDTO.userId) } },
        { new: true },
      )
      .populate({
        path: 'users',
        model: 'Users',
        select: '_id name email avatar',
      });
    if (!added) {
      throw new XNotFound('Group chat!');
    }
    return added;
  }

  async removeMemberInGroup(
    groupChatDTO: GroupChatDTO,
    _id: Types.ObjectId,
  ): Promise<any> {
    const chat = await this.chatModel.findById(groupChatDTO.chatId);

    if (!chat) {
      throw new XNotFound('Group chat');
    }
    if (_id.toString() !== chat.groupAdmin._id.toString()) {
      throw new ServerError('You do not have access!');
    }

    if (chat.users.length < 2) {
      throw new ServerError('You cannot delete this member!');
    }

    const removed = await this.chatModel
      .findByIdAndUpdate(
        groupChatDTO.chatId,
        { $pull: { users: new Types.ObjectId(groupChatDTO.userId) } },
        { new: true },
      )
      .populate({
        path: 'users',
        model: 'Users',
        select: '_id name email avatar',
      });
    if (!removed) {
      throw new XNotFound('Group chat');
    }
    return removed;
  }

  async findMember(
    query: any,
    roleId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<any> {
    let { keyword } = query;

    const data = await this.usersModel.aggregate([
      {
        $match: {
          $or: [
            {
              name: { $regex: `.*${keyword}.*`, $options: 'i' },
            },
            {
              email: { $regex: `.*${keyword}.*`, $options: 'i' },
            },
          ],
          roleId: roleId,
          _id: { $ne: userId },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          avatar: 1,
        },
      },
    ]);
    if (!data) {
      throw new ServerError('Something went wrong!');
    }
    return data;
  }

  async deleteChat(idChat: any, _id: Types.ObjectId): Promise<any> {
    idChat = new Types.ObjectId(idChat);

    const chat = await this.chatModel.findById(idChat);
    if (!chat) {
      throw new XNotFound('Chat');
    }

    if (chat.isGroupChat === true) {
      if (chat.groupAdmin.toString() !== _id.toString()) {
        const removed = await this.chatModel
          .findByIdAndUpdate(
            idChat,
            { $pull: { users: new Types.ObjectId(_id) } },
            { new: true },
          )
          .populate({
            path: 'users',
            model: 'Users',
            select: '_id name email avatar',
          });
        if (!removed) {
          throw new XNotFound('Group chat');
        }
        return true;
      } else {
        const chat = await this.chatModel.deleteOne({ _id: idChat });
        if (!chat) {
          throw new ServerError('Something went wrong!');
        }

        const message = await this.messageModel.deleteMany({ chat: idChat });
        if (!message) {
          throw new ServerError('Something went wrong!');
        }
        return true;
      }
    } else {
      const chat = await this.chatModel.deleteOne({ _id: idChat });
      if (!chat) {
        throw new ServerError('Something went wrong!');
      }

      const message = await this.messageModel.deleteMany({ chat: idChat });
      if (!message) {
        throw new ServerError('Something went wrong!');
      }
      return true;
    }
  }

  async getAllMemberInGroupChat(idChat: string): Promise<any> {
    const data = await this.chatModel
      .findById(idChat)
      .populate({
        path: 'users',
        model: 'Users',
        select: '_id name email avatar',
      })
      .populate({
        path: 'groupAdmin',
        model: 'Users',
        select: '_id name email avatar',
      });

    if (!data) {
      throw new XNotFound('Chat');
    }
    return data;
  }
}
