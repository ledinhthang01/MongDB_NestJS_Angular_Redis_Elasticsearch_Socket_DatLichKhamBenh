import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './enity/users.enity';
import { Model } from 'mongoose';
import { ServerError, XAlreadyExists, XNotFound } from 'src/utils/exception';
import { CreateCenterDTO } from './dto/createNewCenter.dto';
import * as bcrypt from 'bcrypt';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { EditCenterDTO } from './dto/editCenter.dto';
import { CreateEmployeeDTO } from './dto/createEmployee.dto';
import { EditEmployeeDTO } from './dto/editEmployee.dto';
import { MAX_RECORDS } from 'src/utils/constants';
import { CreateDoctorDTO } from './dto/createDoctor.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private usersModel: Model<Users>,
    private elasticService: ElasticsearchService,
  ) {}

  async create(
    dataDto: CreateCenterDTO | CreateEmployeeDTO | CreateDoctorDTO,
  ): Promise<Users> {
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

    const id = data['_id'];
    delete data['_id'];

    const dataElastic = await this.elasticService.create({
      index: 'users',
      id,
      body: data,
    });

    if (!dataElastic) {
      throw new ServerError('Something went wrong!');
    }
    data._id = id;
    delete data.password;
    return data;
  }

  async getAll(data: any, roleId: string, centerId?: string): Promise<any> {
    let {
      page = '',
      size = '',
      gender = '',
      active = '',
      searchString = '',
    } = data;
    page = parseInt(page);
    size = parseInt(size);

    size = size >= MAX_RECORDS ? MAX_RECORDS : size;

    const query = {
      bool: {
        must: [],
      },
    };

    if (roleId) {
      query.bool.must.push({ term: { roleId: roleId } });
    }

    if (centerId) {
      query.bool.must.push({ term: { centerId: centerId } });
    }

    if (active) {
      query.bool.must.push({ term: { active: active } });
    }

    if (gender) {
      query.bool.must.push({ term: { gender: gender } });
    }

    if (searchString) {
      query.bool.must.push({
        match: {
          name: {
            query: searchString,
            operator: 'and',
            fuzziness: 'AUTO',
          },
        },
      });
    }

    const search = await this.elasticService.search({
      index: 'users',
      body: {
        query: query,
        _source: {
          excludes: ['password'],
        },
        from: (page - 1) * size,
        size: size,
      },
    });

    const total = search.hits.total['value'];

    return {
      page,
      size: search.hits.hits.length,
      active,
      gender,
      searchString,
      total,
      data: search.hits.hits,
    };
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

  async findUserById(id: string): Promise<any> {
    const search = await this.elasticService.search({
      index: 'users',
      body: {
        query: {
          term: {
            _id: id,
          },
        },
        _source: {
          excludes: ['password'],
        },
      },
    });

    let result = search.hits.hits[0];

    if (!result) {
      const data = await this.usersModel.findById(id);
      if (!data) {
        throw new XNotFound('User');
      }
      delete data.password;
      return data;
    }

    return result;
  }

  async editInfor(dataDto: EditCenterDTO | EditEmployeeDTO): Promise<Users> {
    const search = await this.elasticService.search({
      index: 'users',
      body: {
        query: {
          term: {
            _id: dataDto.id,
          },
        },
        _source: {
          excludes: ['password'],
        },
      },
    });
    let result = search.hits.hits[0];

    if (!result) {
      throw new XNotFound('User');
    }

    if (result._source['email'] !== dataDto.email) {
      const email = dataDto.email;
      const existingUser = await this.usersModel.findOne({ email });
      if (existingUser) {
        throw new XAlreadyExists('Email');
      }
    }

    const id = dataDto.id;
    delete dataDto.id;

    const updateElastic = await this.elasticService.update({
      index: 'users',
      id: id,
      body: {
        doc: dataDto,
      },
    });

    if (!updateElastic) {
      throw new ServerError('Something went wrong update!');
    }

    const updateDB = await this.usersModel
      .findByIdAndUpdate(id, dataDto, {
        new: true,
      })
      .select('-password');
    if (!updateDB) {
      throw new ServerError('Something went wrong update!');
    }

    return updateDB;
  }

  async deleteData(id: string): Promise<any> {
    const data = await this.usersModel.findByIdAndDelete(id).exec();
    if (!data) {
      throw new ServerError('Something went wrong delete!');
    }
    const dataElastic = await this.elasticService.delete({
      index: 'users',
      id: id,
    });
    if (!dataElastic) {
      throw new ServerError('Something went wrong delete!');
    }
    return dataElastic;
  }
}
