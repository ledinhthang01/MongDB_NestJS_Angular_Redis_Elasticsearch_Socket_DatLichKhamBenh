import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { RolesDTO } from './dto/roles.dto';
import { ApiTags } from '@nestjs/swagger';
import { handleSendRequest } from 'src/utils/utils';
import { Response } from 'express';

@ApiTags('role')
@Controller('role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post()
  async createRoles(@Body() rolesDTO: RolesDTO, @Res() res: Response) {
    const data = await this.roleService.createRoles(rolesDTO);
    handleSendRequest(res, 'Create role successfully!', 201, data);
  }

  @Put(':id')
  async editRoles(
    @Param('id') id: string,
    @Body() rolesDTO: RolesDTO,
    @Res() res: Response,
  ) {
    const data = await this.roleService.editRoles(id, rolesDTO);
    handleSendRequest(res, 'Edit role successfully!', 200, data);
  }

  @Get()
  async getAllRoles(@Res() res: Response) {
    const data = await this.roleService.getAllRoles();
    handleSendRequest(res, 'Get all roles successfully!', 200, data);
  }

  @Get(':id')
  async getRolesById(@Param('id') id: string, @Res() res: Response) {
    const data = await this.roleService.getRolesById(id);
    handleSendRequest(res, 'Get role successfully!', 200, data);
  }

  @Delete(':id')
  async deleteRoles(@Param('id') id: string, @Res() res: Response) {
    const data = await this.roleService.deleteRoles(id);
    handleSendRequest(res, 'Delete role successfully!', 200, data);
  }
}
