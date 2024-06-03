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
    try {
      return await this.permissionResourcesModel.create(permissionResourcesDTO);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async editPermissionResources(
    id: string,
    permissionResourcesDTO: PermissionResourcesDTO,
  ): Promise<permission_resources> {
    try {
      const data = await this.permissionResourcesModel
        .findByIdAndUpdate(id, permissionResourcesDTO, { new: true })
        .exec();
      if (!data) {
        throw new XNotFound('Permission resource');
      }

      return data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getAllPermissionResources(): Promise<permission_resources[]> {
    try {
      return await this.permissionResourcesModel.find().exec();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getPermissionResourcesById(id: string): Promise<permission_resources> {
    try {
      const data = await this.permissionResourcesModel.findById(id).exec();
      if (!data) {
        throw new XNotFound(id);
      }
      return data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deletePermissionResources(id: string): Promise<permission_resources> {
    try {
      const data = await this.permissionResourcesModel
        .findByIdAndDelete(id)
        .exec();
      if (!data) {
        throw new XNotFound(id);
      }
      return data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async find(data: any): Promise<any> {
    return await this.permissionResourcesModel.find(data);
  }
}
