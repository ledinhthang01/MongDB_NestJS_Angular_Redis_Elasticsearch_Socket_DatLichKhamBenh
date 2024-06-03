import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './enity/users.enity';
import { Model } from 'mongoose';
import { XNotFound } from 'src/utils/exception';

@Injectable()
export class UsersService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    @InjectModel(Users.name) private usersModel: Model<Users>,
  ) {}

  async findById(id: string): Promise<Users> {
    try {
      const data = await this.usersModel.findById(id);
      if (!data) {
        throw new XNotFound('User');
      }
      return data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
