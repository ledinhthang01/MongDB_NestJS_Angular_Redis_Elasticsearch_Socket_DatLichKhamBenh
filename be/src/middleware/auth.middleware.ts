import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const accessToken = (req.headers?.authorization as string)?.split(' ')[1];
      if (!accessToken) {
        throw new UnauthorizedException('Token is not provided');
      }

      const jwtObject = this.jwtService.verify(accessToken, {
        secret: process.env.JWT_SECRET_TOKEN,
      });

      if (!jwtObject) {
        throw new UnauthorizedException('Token is expired');
      } else {
        req.user = await this.userService.findById(jwtObject.id);
        next();
        return;
      }
      next();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token is expired');
      }
      throw new UnauthorizedException(error.message);
    }
  }
}
