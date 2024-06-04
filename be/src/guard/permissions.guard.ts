import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PermissionResourcesService } from 'src/permission_resources/permission_resources.service';
import { RoleService } from 'src/role/role.service';
import { XNotFound } from 'src/utils/exception';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private roleService: RoleService,
    private permissionResourcesService: PermissionResourcesService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.user.roleId) {
      throw new UnauthorizedException('Invalid token data');
    }

    const roleInfo = await this.roleService.findById(request.user.roleId);

    if (!roleInfo) {
      throw new XNotFound('Role');
    }

    const listPermission = await this.permissionResourcesService.find({
      _id: { $in: roleInfo.permissionResources },
    });

    if (!listPermission) {
      throw new XNotFound('Permission resources');
    }

    if (listPermission.some((e) => e.code === request.url.split('/')[2])) {
      return true;
    } else {
      throw new UnauthorizedException('You do not have access');
    }
  }
}
