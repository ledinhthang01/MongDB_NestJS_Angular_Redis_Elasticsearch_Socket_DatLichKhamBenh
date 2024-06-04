import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpDTO } from './dto/signUp.dto';
import { Request, Response } from 'express';
import { HttpStatusCode, handleSendRequest } from 'src/utils/utils';
import { SignInDTO } from './dto/signIn.dto';
import { PermissionsGuard } from 'src/guard/permissions.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signUpDTO: SignUpDTO, @Res() res: Response) {
    try {
      const data = await this.authService.signUp(signUpDTO);
      handleSendRequest(
        res,
        'Sign up successfully!, Please check your email to get password',
        HttpStatusCode.INSERT_OK,
        data,
      );
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Get(':id')
  async get(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.authService.get(id);
      handleSendRequest(res, 'Get successfully!', HttpStatusCode.OK, data);
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Post('signin')
  async signIn(@Body() signInDTO: SignInDTO, @Res() res: Response) {
    try {
      const data = await this.authService.signIn(signInDTO);
      handleSendRequest(res, 'Sign in successfully!', HttpStatusCode.OK, data);
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Get('get-with-cache/123456789')
  @UseGuards(PermissionsGuard)
  async setWithCache(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    try {
      const data = await this.authService.getWithCache(id);
      handleSendRequest(
        res,
        'Get cache successfully!',
        HttpStatusCode.OK,
        data,
      );
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Get('set-with-cache/:id')
  async getWithCache(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.authService.setWithCache(id);
      handleSendRequest(
        res,
        'Set cache successfully!',
        HttpStatusCode.OK,
        data,
      );
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Post('refreshToken')
  async refreshToken(@Res() res: Response, @Req() req: Request) {
    try {
      const data = await this.authService.refreshToken(req);
      handleSendRequest(res, 'Successfully!', HttpStatusCode.OK, data);
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Put('logout')
  async logOut(@Req() req: Request, @Res() res: Response) {
    try {
      const data = await this.authService.logOut(req);
      handleSendRequest(res, 'Log out successfully!', HttpStatusCode.OK, data);
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ message: error.message });
    }
  }
}
