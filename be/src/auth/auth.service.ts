import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpDTO } from './dto/signUp.dto';
import { Users } from 'src/users/enity/users.enity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { XAlreadyExists } from 'src/utils/exception';
import * as bcrypt from 'bcrypt';
import { ID_ROLE_USER } from 'src/utils/constants';

@Injectable()
export class AuthService {
  constructor(@InjectModel(Users.name) private usersModel: Model<Users>) {}

  async signUp(signUpDTO: SignUpDTO): Promise<any> {
    try {
      const existingUser = await this.usersModel
        .findOne({ email: signUpDTO.email })
        .exec();
      if (existingUser) {
        throw new XAlreadyExists('Email');
      }

      const password = '123456';
      signUpDTO.password = await bcrypt.hash(
        password,
        parseInt(process.env.SALT_ROUNDS),
      );

      signUpDTO.roleId = ID_ROLE_USER;

      return await this.usersModel.create(signUpDTO);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
