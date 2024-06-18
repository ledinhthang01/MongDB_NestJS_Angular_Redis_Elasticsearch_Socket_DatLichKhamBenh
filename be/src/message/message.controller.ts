import {
  Body,
  Controller,
  Delete,
  Get,
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

@ApiTags('message')
@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

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

  @Get('check-message/:id')
  async checkMessage(
    @Res() res: Response,
    @Req() req: Request,
    @Param('id') idMessage: string,
  ) {
    try {
      const data = await this.messageService.checkMessage(
        idMessage,
        req.user['_id'],
      );
      handleSendRequest(res, '', HttpStatusCode.OK, data);
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
      handleSendRequest(res, 'Delete message successfully!', HttpStatusCode.OK, data);
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }
}
