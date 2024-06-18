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
import { MessageService } from './message.service';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { HttpStatusCode, handleSendRequest } from 'src/utils/utils';
import { SendMessageDTO } from './dto/sendMessage.dto';
import { EditMessageDTO } from './dto/editMessage.dto';
import { EventGateway } from 'src/event.gateway';

@ApiTags('message')
@Controller('message')
export class MessageController {
  constructor(
    private messageService: MessageService,
    @Inject(EventGateway) private eventGateway: EventGateway,
  ) {}

  @Get('get-all-message/')
  async getAllMessages(@Res() res: Response, @Query() query: any) {
    try {
      const data = await this.messageService.getAllMessages(query);
      handleSendRequest(
        res,
        'Get all message successfully!',
        HttpStatusCode.OK,
        data,
      );
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Post('send-message')
  async sendMessage(
    @Res() res: Response,
    @Req() req: Request,
    @Body() sendMessageDTO: SendMessageDTO,
  ) {
    try {
      const data = await this.messageService.sendMessage(
        sendMessageDTO,
        req.user['_id'],
      );

      if (data.chat.isGroupChat === true) {
        this.eventGateway.handleEmiSocket(
          data,
          'messageRecieved',
          String(data.chat._id),
        );
      } else {
        data.chat.users.map((user) => {
          this.eventGateway.handleEmiSocket(data, 'messageRecieved', user);
        });
      }
      handleSendRequest(
        res,
        'Send message successfully!',
        HttpStatusCode.INSERT_OK,
        data,
      );
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Put('edit-message')
  async editMessage(
    @Res() res: Response,
    @Req() req: Request,
    @Body() editMessageDTO: EditMessageDTO,
  ) {
    try {
      const data = await this.messageService.editMessage(
        editMessageDTO,
        req.user['_id'],
      );
      this.eventGateway.handleEmiSocket(
        data,
        'editMessage',
        String(data.chat._id),
      );
      handleSendRequest(
        res,
        'Edit message successfully!',
        HttpStatusCode.OK,
        data,
      );
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Delete('delete-message/:id')
  async deleteMessage(
    @Res() res: Response,
    @Req() req: Request,
    @Param('id') idMessage: string,
  ) {
    try {
      const data = await this.messageService.deleteMessage(
        idMessage,
        req.user['_id'],
      );
      this.eventGateway.handleEmiSocket(
        data,
        'deleteMessage',
        String(data.chat._id),
      );
      handleSendRequest(
        res,
        'Delete message successfully!',
        HttpStatusCode.OK,
        data,
      );
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }
}
