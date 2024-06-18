import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response, query } from 'express';
import { HttpStatusCode, handleSendRequest } from 'src/utils/utils';
import { AccessChatDTO } from './dto/accessChat.dto';
import { CreateGroupChat } from './dto/createGroupChat.dto';
import { RenameGroupDTO } from './dto/reNameGroup.dto';
import { GroupChatDTO } from './dto/removeMember.dto';
import { EventGateway } from 'src/event.gateway';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(
    private chatService: ChatService,
    @Inject(EventGateway) private eventGateway: EventGateway,
  ) {}

  @Post('')
  async accessChat(
    @Res() res: Response,
    @Body() accessChatDTO: AccessChatDTO,
    @Req() req: Request,
  ) {
    try {
      const data = await this.chatService.accessChat(accessChatDTO, req.user);
      data.users.map((user) => {
        this.eventGateway.handleEmiSocket(data, 'accessChat', user._id);
      });
      handleSendRequest(
        res,
        'Chat successfully!',
        HttpStatusCode.INSERT_OK,
        data,
      );
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Get('')
  async fetchChats(@Res() res: Response, @Req() req: Request) {
    try {
      const data = await this.chatService.fetchChats(req.user['_id']);
      handleSendRequest(
        res,
        'Fetch chat successfully!',
        HttpStatusCode.OK,
        data,
      );
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Post('create-group-chat')
  async createGroupChat(
    @Res() res: Response,
    @Req() req: Request,
    @Body() createGroupChat: CreateGroupChat,
  ) {
    try {
      const data = await this.chatService.createGroupChat(
        createGroupChat,
        req.user,
      );
      handleSendRequest(
        res,
        'Create group chat successfully!',
        HttpStatusCode.INSERT_OK,
        data,
      );
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Put('rename-group-chat')
  async renameGroup(
    @Res() res: Response,
    @Req() req: Request,
    @Body() renameGroupDTO: RenameGroupDTO,
  ) {
    try {
      const data = await this.chatService.renameGroup(
        renameGroupDTO,
        req.user['_id'],
      );
      handleSendRequest(
        res,
        'Rename group chat successfully!',
        HttpStatusCode.OK,
        data,
      );
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Put('remove-member-in-group')
  async removeMemberInGroup(
    @Res() res: Response,
    @Req() req: Request,
    @Body() groupChatDTO: GroupChatDTO,
  ) {
    try {
      const data = await this.chatService.removeMemberInGroup(
        groupChatDTO,
        req.user['_id'],
      );
      handleSendRequest(
        res,
        'Remove member in group chat successfully!',
        HttpStatusCode.OK,
        data,
      );
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Put('add-member-to-group')
  async addMemberToGroup(
    @Res() res: Response,
    @Body() groupChatDTO: GroupChatDTO,
  ) {
    try {
      const data = await this.chatService.addMemberToGroup(groupChatDTO);
      handleSendRequest(
        res,
        'Add member in group chat successfully!',
        HttpStatusCode.OK,
        data,
      );
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Get('find-member')
  async findMember(
    @Res() res: Response,
    @Req() req: Request,
    @Query() query: any,
  ) {
    try {
      const data = await this.chatService.findMember(
        query,
        req.user['roleId'],
        req.user['_id'],
      );
      handleSendRequest(
        res,
        'Find user successfully!',
        HttpStatusCode.OK,
        data,
      );
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Delete('delete-chat/:id')
  async deleteChat(
    @Res() res: Response,
    @Req() req: Request,
    @Param('id') idChat: string,
  ) {
    try {
      const data = await this.chatService.deleteChat(idChat, req.user['_id']);
      handleSendRequest(
        res,
        'Delete chat successfully!',
        HttpStatusCode.OK,
        data,
      );
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Get('get-all-member-in-group-chat/:id')
  async getAllMemberInGroupChat(
    @Res() res: Response,
    @Param('id') idChat: string,
  ) {
    try {
      const data = await this.chatService.getAllMemberInGroupChat(idChat);
      handleSendRequest(
        res,
        'Get all member in group chat successfully!',
        HttpStatusCode.OK,
        data,
      );
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }
}
