import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { roles } from './enity/role.enity';
import { Model, Types } from 'mongoose';
import { RolesDTO } from './dto/roles.dto';
import { XNotFound } from 'src/utils/exception';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(roles.name)
    private rolesModel: Model<roles>,
  ) {}

  async createRoles(rolesDTO: RolesDTO): Promise<roles> {
    try {
      return await this.rolesModel.create(rolesDTO);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async editRoles(id: string, rolesDTO: RolesDTO): Promise<roles> {
    try {
      return await this.rolesModel
        .findByIdAndUpdate(id, rolesDTO, { new: true })
        .exec();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getAllRoles(): Promise<roles[]> {
    try {
      return await this.rolesModel.find().exec();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getRolesById(id: string): Promise<roles> {
    try {
      return await this.rolesModel.findById(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deleteRoles(id: string): Promise<roles> {
    try {
      return await this.rolesModel.findByIdAndDelete(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findById(id: string): Promise<roles> {
    try {
      const data = await this.rolesModel.findById(id);
      if (!data) {
        throw new XNotFound('Role');
      }
      return data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
