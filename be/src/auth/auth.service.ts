import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpDTO } from './dto/signUp.dto';
import { Users } from 'src/users/enity/users.enity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServerError, XAlreadyExists, XNotFound } from 'src/utils/exception';
import * as bcrypt from 'bcrypt';
import { ID_ROLE_USER } from 'src/utils/constants';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { SignInDTO } from './dto/signIn.dto';
import { roles } from 'src/role/enity/role.enity';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Request } from 'express';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Users.name) private usersModel: Model<Users>,
    @InjectModel(roles.name) private rolesModel: Model<roles>,
    private elasticService: ElasticsearchService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectQueue('send-mail')
    private sendMail: Queue,
    private eventEmitter: EventEmitter2,
  ) {}

  async signUp(signUpDTO: SignUpDTO): Promise<any> {
    const existingUser = await this.usersModel
      .findOne({ email: signUpDTO.email })
      .exec();
    if (existingUser) {
      throw new XAlreadyExists('Email');
    }

    const password = Math.floor(Math.random() * Date.now()).toString(36);

    signUpDTO.password = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUNDS),
    );

    signUpDTO.roleId = ID_ROLE_USER;

    const data = JSON.parse(
      JSON.stringify(await this.usersModel.create(signUpDTO)),
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

    await this.sendMail.add(
      'signUp',
      {
        to: signUpDTO.email,
        name: signUpDTO.name,
        password: password,
      },
      {
        removeOnComplete: true,
      },
    );

    return true;
  }

  async signIn(signInDTO: SignInDTO): Promise<any> {
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

        const url = (await this.rolesModel.findById(existingUser.roleId).exec())
          .roleName;

        existingUser.refreshToken =
          (await refreshToken) ?? existingUser.refreshToken;
        await existingUser.save();
        this.eventEmitter.emit('SignInId', String(existingUser._id));

        return {
          _id: existingUser._id,
          name: existingUser.name,
          email: existingUser.email,
          avatar: existingUser.avatar,
          url: url,
          accessToken: await accessToken,
          refreshToken: await refreshToken,
        };
      } else {
        throw new ServerError('Wrong email or password!');
      }
    } else {
      throw new ServerError('You cannot sign in, please contact to admin!');
    }
  }

  async getWithCache(id: string): Promise<any> {
    return await this.cacheManager.get('abc');
  }

  async setWithCache(id): Promise<any> {
    await this.cacheManager.set('abc', id);
    return true;
  }

  async generateToken(payload, time): Promise<string> {
    const options: JwtSignOptions = { expiresIn: time };
    return await this.jwtService.signAsync(payload, options);
  }

  async refreshToken(req: Request): Promise<any> {
    const token = req.headers.refreshtoken;
    if (token) {
      const result = await this.checkToken(token);
      if (result) {
        return await this.handleNewToken(token);
      } else {
        throw new ServerError('Sign in, please!');
      }
    } else {
      throw new XNotFound('Refresh token');
    }
  }

  async handleNewToken(token): Promise<any> {
    const jwtObject = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET_TOKEN,
    });

    if (!jwtObject) {
      throw new ServerError('Something went wrong');
    } else {
      let expiresIn = jwtObject.exp - Math.floor(Date.now() / 1000);

      delete jwtObject.exp;
      const newRefreshToken = await this.generateToken(jwtObject, expiresIn);

      let newAccessToken = await this.generateToken(
        { id: jwtObject.id, roleId: jwtObject.roleId },
        '4.5h',
      );
      await this.usersModel.updateOne(
        { _id: jwtObject.id },
        { $set: { refreshToken: newRefreshToken } },
      );
      return {
        newRefreshToken,
        newAccessToken,
      };
    }
  }

  async checkToken(token): Promise<any> {
    const existingUser = await this.usersModel.findOne({
      refreshToken: { $eq: token },
    });
    if (existingUser) {
      const jwtObject = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET_TOKEN,
      });
      if (!jwtObject) {
        await this.usersModel.findByIdAndUpdate(
          existingUser._id,
          { refreshToken: '' },
          { new: true },
        );
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  async logOut(req: Request): Promise<any> {
    const data = await this.usersModel
      .findByIdAndUpdate(req.user['_id'], { refreshToken: '' })
      .exec();
    if (!data) {
      throw new ServerError('Something went wrong!');
    }
    return data._id;
  }
}
