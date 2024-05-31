import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpDTO } from './dto/signUp.dto';
import { Users } from 'src/users/enity/users.enity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { XAlreadyExists } from 'src/utils/exception';
import * as bcrypt from 'bcrypt';
import { ID_ROLE_USER } from 'src/utils/constants';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { SignInDTO } from './dto/signIn.dto';
import { roles } from 'src/role/enity/role.enity';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Users.name) private usersModel: Model<Users>,
    @InjectModel(roles.name) private rolesModel: Model<roles>,
    private elasticService: ElasticsearchService,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDTO: SignUpDTO): Promise<any> {
    try {
      const existingUser = await this.usersModel
        .findOne({ email: signUpDTO.email })
        .exec();
      if (existingUser) {
        throw new XAlreadyExists('Email');
      }

      signUpDTO.password = await bcrypt.hash(
        '123456',
        parseInt(process.env.SALT_ROUNDS),
      );

      signUpDTO.roleId = ID_ROLE_USER;

      const data = JSON.parse(
        JSON.stringify(await this.usersModel.create(signUpDTO)),
      );

      const id = data['_id'];
      delete data['_id'];

      return await this.elasticService.create({
        index: 'users',
        id,
        body: data,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async signIn(signInDTO: SignInDTO): Promise<any> {
    try {
      let existingUser = await this.usersModel
        .findOne({ email: signInDTO.email })
        .exec();

      if (existingUser.active === 'active') {
        let isMatch = await bcrypt.compare(
          signInDTO.password,
          existingUser.password,
        );

        if (isMatch) {
          const payloadRefresh = {
            id: existingUser._id,
            name: existingUser.name,
            phoneNumber: existingUser.phoneNumber,
            roleId: existingUser.roleId,
          };

          const refreshToken = this.generateToken(payloadRefresh, '1y');

          const payloadAccess = {
            id: existingUser._id,
            roleId: existingUser.roleId,
          };

          const accessToken = this.generateToken(payloadAccess, '4.5h');

          const url = (
            await this.rolesModel.findById(existingUser.roleId).exec()
          ).roleName;

          existingUser.refreshToken =
            (await refreshToken) ?? existingUser.refreshToken;
          await existingUser.save();

          await this.elasticService.update({
            index: 'users',
            id: existingUser._id.toString(),
            body: {
              script: {
                source: 'ctx._source.refreshToken = params.newRefreshToken',
                params: {
                  refreshToken,
                },
              },
            },
          });

          return {
            _id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
            avatar: existingUser.avatar,
            url: url,
            accessToken: await accessToken,
            refreshToken: await refreshToken,
          };
        }
      }
      return '0';
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async get(id): Promise<any> {
    try {
      return await this.elasticService.get({
        index: 'users',
        id: id,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async generateToken(payload, time): Promise<string> {
    const options: JwtSignOptions = { expiresIn: time };
    return await this.jwtService.signAsync(payload, options);
  }
}
