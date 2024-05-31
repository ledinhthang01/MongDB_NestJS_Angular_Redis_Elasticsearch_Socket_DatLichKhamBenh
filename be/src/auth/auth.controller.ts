import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpDTO } from './dto/signUp.dto';
import { Response } from 'express';
import { handleSendRequest } from 'src/utils/utils';
import { SignInDTO } from './dto/signIn.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signUpDTO: SignUpDTO, @Res() res: Response) {
    const data = await this.authService.signUp(signUpDTO);
    handleSendRequest(res, 'Sign up successfully!', 201, data);
  }

  @Get(':id')
  async get(@Param('id') id: string, @Res() res: Response) {
    const data = await this.authService.get(id);
    handleSendRequest(res, 'Get successfully!', 200, data);
  }

  @Post('signin')
  async signIn(@Body() signInDTO: SignInDTO, @Res() res: Response) {
    const data = await this.authService.signIn(signInDTO);
    handleSendRequest(res, 'Sign in successfully!', 200, data);
  }
}
