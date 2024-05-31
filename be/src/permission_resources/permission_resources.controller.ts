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
import { PermissionResourcesService } from './permission_resources.service';
import { ApiTags } from '@nestjs/swagger';
import { PermissionResourcesDTO } from './dto/permissionResources.dto';
import { handleSendRequest } from 'src/utils/utils';
import { Response } from 'express';

@ApiTags('permission-resources')
@Controller('permission-resources')
export class PermissionResourcesController {
  constructor(private permissionResourcesService: PermissionResourcesService) {}

  @Post()
  async createPermissionResources(
    @Body() permissionResourcesDTO: PermissionResourcesDTO,
    @Res() res: Response,
  ) {
    const data =
      await this.permissionResourcesService.createPermissionResources(
        permissionResourcesDTO,
      );
    handleSendRequest(
      res,
      'Create permission resource successfully!',
      201,
      data,
    );
  }

  @Put(':id')
  async editPermissionResources(
    @Body() permissionResourcesDTO: PermissionResourcesDTO,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const data = await this.permissionResourcesService.editPermissionResources(
      id,
      permissionResourcesDTO,
    );
    handleSendRequest(
      res,
      'Update permission resource successfully!',
      200,
      data,
    );
  }

  @Get()
  async getAllPermissionResources(@Res() res: Response) {
    const data =
      await this.permissionResourcesService.getAllPermissionResources();
    handleSendRequest(
      res,
      'Get all permission resource successfully!',
      200,
      data,
    );
  }

  @Get(':id')
  async getAllPermissionResourcesById(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const data =
      await this.permissionResourcesService.getPermissionResourcesById(id);
    handleSendRequest(res, 'Get permission resource successfully!', 200, data);
  }

  @Delete(':id')
  async deletePermissionResources(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const data =
      await this.permissionResourcesService.deletePermissionResources(id);
    handleSendRequest(
      res,
      'Delete permission resource successfully!',
      200,
      data,
    );
  }
}
