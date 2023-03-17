import { BadRequestError, NotFoundError } from '@/error';
import { saveAvatar } from '@/helpers/saveAvatar';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserDocument, User, Avatar, AvatarDocument } from './schemas';
import * as fs from 'fs';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Avatar.name) private avatarModel: Model<AvatarDocument>,
    private readonly httpService: HttpService,
  ) {}

  async create(createUser: CreateUserDTO): Promise<User> {
    const user = await this.findByEmail(createUser.email);
    const counter = await this.userModel.countDocuments();

    if (user) {
      throw new BadRequestError('user already exists');
    }

    const newUser = new this.userModel({
      id: counter + 1,
      first_name: createUser.first_name,
      last_name: createUser.last_name,
      email: createUser.email,
    });

    return newUser.save();
  }

  async findByEmail(email: string): Promise<User> {
    const user = this.userModel.findOne({ email }).exec();
    return user;
  }

  async findById(id: number): Promise<User> {
    try {
      const response = await this.httpService.axiosRef.get(
        `https://reqres.in/api/users/${id}`,
      );

      const user = response.data.data;

      return user;
    } catch (err) {
      throw new NotFoundError('user not found');
    }
  }

  async getAvatar(id: number): Promise<string> {
    let user = await this.userModel.findOne({ id }).exec();

    if (!user) {
      const newUser = await this.findById(id);
      user = await new this.userModel(newUser).save();
    }

    if (!fs.existsSync(`${user.avatar}`)) {
      const path = await saveAvatar(user.avatar, user.id);

      user = await this.userModel
        .findByIdAndUpdate(user._id, { avatar: path })
        .exec();
    }

    return fs.readFileSync(`${process.cwd()}/avatars/${user.id}.jpg`, 'base64');
  }

  async deleteAvatar(id: number): Promise<User> {
    const user = await this.userModel.findOne({ id });
    if (!user || !user.avatar) {
      throw new NotFoundError(`User with id ${id} not found or has no avatar`);
    }

    await fs.promises.unlink(user.avatar);

    user.avatar = '';
    const updatedUser = await user.save();
    return updatedUser;
  }
}
