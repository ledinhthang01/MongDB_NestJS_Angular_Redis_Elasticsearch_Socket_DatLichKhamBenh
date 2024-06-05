import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { roles } from './enity/role.enity';
import { Model, Types } from 'mongoose';
import { RolesDTO } from './dto/roles.dto';
import { ServerError, XNotFound } from 'src/utils/exception';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(roles.name)
    private rolesModel: Model<roles>,
  ) {}

  async createRoles(rolesDTO: RolesDTO): Promise<roles> {
    const data = await this.rolesModel.create(rolesDTO);
    if (!data) {
      throw new ServerError('Something went wrong!');
    }
    return data;
  }

  async editRoles(id: string, rolesDTO: RolesDTO): Promise<roles> {
    const data = await this.rolesModel
      .findByIdAndUpdate(id, rolesDTO, { new: true })
      .exec();
    if (!data) {
      throw new ServerError('Something went wrong!');
    }
    return data;
  }

  async getAllRoles(): Promise<roles[]> {
    const data = await this.rolesModel.find().exec();
    if (!data) {
      throw new ServerError('Something went wrong!');
    }
    return data;
  }

  async getRolesById(id: string): Promise<roles> {
    const data = await this.rolesModel.findById(id);
    if (!data) {
      throw new ServerError('Something went wrong!');
    }
    return data;
  }

  async deleteRoles(id: string): Promise<roles> {
    const data = await this.rolesModel.findByIdAndDelete(id);
    if (!data) {
      throw new ServerError('Something went wrong!');
    }
    return data;
  }

  async findById(id: string): Promise<roles> {
    const data = await this.rolesModel.findById(id);
    if (!data) {
      throw new XNotFound('Role');
    }
    return data;
  }
}
