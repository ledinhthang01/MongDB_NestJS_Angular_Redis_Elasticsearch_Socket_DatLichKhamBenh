import { Body, Controller, Get, Post, Put, Req, Res } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { HttpStatusCode, handleSendRequest } from 'src/utils/utils';
import { AccessChatDTO } from './dto/accessChat.dto';
import { CreateGroupChat } from './dto/createGroupChat.dto';
import { RenameGroupDTO } from './dto/reNameGroup.dto';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post('')
  async accessChat(
    @Res() res: Response,
    @Body() accessChatDTO: AccessChatDTO,
    @Req() req: Request,
  ) {
    try {
      const data = await this.chatService.accessChat(accessChatDTO, req.user);
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
}
