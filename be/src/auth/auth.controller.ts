import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpDTO } from './dto/signUp.dto';
import { Response } from 'express';
import { handleSendRequest } from 'src/utils/utils';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signUpDTO: SignUpDTO, @Res() res: Response) {
    const data = await this.authService.signUp(signUpDTO);
    handleSendRequest(res, 'Sign up successfully!', 201, data);
  }
}
