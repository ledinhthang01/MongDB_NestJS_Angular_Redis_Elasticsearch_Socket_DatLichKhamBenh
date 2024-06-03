import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { RoleService } from 'src/role/role.service';
import { PermissionResourcesService } from 'src/permission_resources/permission_resources.service';
import { XNotFound } from 'src/utils/exception';

@Injectable()
export class CheckPermissionMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private roleService: RoleService,
    private permissionResourcesService: PermissionResourcesService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = (req.headers?.access_token as string)?.split(' ')[1];

      if (!token) {
        throw new UnauthorizedException('Invalid token');
      }
      const jwtObject = this.jwtService.verify(token);

      if (!jwtObject?.roleId) {
        throw new UnauthorizedException('Invalid token data');
      }

      const roleInfo = await this.roleService.findById(jwtObject.roleId);

      if (!roleInfo) {
        throw new XNotFound('Role');
      }

      const listPermission = await this.permissionResourcesService.find({
        _id: { $in: roleInfo.permissionResources },
      });

      if (!listPermission) {
        throw new XNotFound('Permission resources');
      }

      if (
        listPermission.some((e) => e.code === req.params['0'].split('/')[1])
      ) {
        next();
      } else {
        throw new UnauthorizedException('You do not have access');
      }
    } catch (error) {
      throw new UnauthorizedException('You do not have access');
    }
  }
}
