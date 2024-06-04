import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { permission_resources } from './enity/permission_resources.enity';
import { Model } from 'mongoose';
import { PermissionResourcesDTO } from './dto/permissionResources.dto';
import { XNotFound } from 'src/utils/exception';

@Injectable()
export class PermissionResourcesService {
  constructor(
    @InjectModel(permission_resources.name)
    private permissionResourcesModel: Model<permission_resources>,
  ) {}

  async createPermissionResources(
    permissionResourcesDTO: PermissionResourcesDTO,
  ): Promise<permission_resources> {
    return await this.permissionResourcesModel.create(permissionResourcesDTO);
  }

  async editPermissionResources(
    id: string,
    permissionResourcesDTO: PermissionResourcesDTO,
  ): Promise<permission_resources> {
    const data = await this.permissionResourcesModel
      .findByIdAndUpdate(id, permissionResourcesDTO, { new: true })
      .exec();
    if (!data) {
      throw new XNotFound('Permission resource');
    }

    return data;
  }

  async getAllPermissionResources(): Promise<permission_resources[]> {
    return await this.permissionResourcesModel.find().exec();
  }

  async getPermissionResourcesById(id: string): Promise<permission_resources> {
    const data = await this.permissionResourcesModel.findById(id).exec();
    if (!data) {
      throw new XNotFound(id);
    }
    return data;
  }

  async deletePermissionResources(id: string): Promise<permission_resources> {
    const data = await this.permissionResourcesModel
      .findByIdAndDelete(id)
      .exec();
    if (!data) {
      throw new XNotFound(id);
    }
    return data;
  }

  async find(data: any): Promise<any> {
    return await this.permissionResourcesModel.find(data);
  }
}
