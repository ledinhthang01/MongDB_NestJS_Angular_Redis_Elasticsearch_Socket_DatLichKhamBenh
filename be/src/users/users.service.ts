import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './enity/users.enity';
import { Model } from 'mongoose';
import { ServerError, XAlreadyExists, XNotFound } from 'src/utils/exception';
import { CreateCenterDTO } from './dto/createNewCenter.dto';
import * as bcrypt from 'bcrypt';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class UsersService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    @InjectModel(Users.name) private usersModel: Model<Users>,
    private elasticService: ElasticsearchService,
  ) {}

  async create(dataDto: CreateCenterDTO): Promise<Users> {
    const email = dataDto.email;
    const existingUser = await this.usersModel.findOne({ email }).exec();

    if (existingUser) {
      throw new ConflictException('User already exists!');
    }

    dataDto.password = await bcrypt.hash(
      '123456',
      parseInt(process.env.SALT_ROUNDS),
    );

    const data = JSON.parse(
      JSON.stringify(await this.usersModel.create(dataDto)),
    );

    if (!data) {
      throw new ServerError('Something went wrong!');
    }

    // const id = data['_id'];
    // delete data['_id'];

    // const dataElastic = await this.elasticService.create({
    //   index: 'users',
    //   id,
    //   body: data,
    // });

    // if (!dataElastic) {
    //   throw new ServerError('Something went wrong!');
    // }
    return data;
  }

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
