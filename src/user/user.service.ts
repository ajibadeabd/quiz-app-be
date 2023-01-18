import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { User, UserDocument } from './entity/user.schema';
import { IUser } from './interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}
  async createUser(body: IUser): Promise<User> {
    const isUserExist = await this.getUser({ name: body.name });
    if (!isUserExist) {
      throw new HttpException('username taken', 400);
    }
    return this.userModel.create(body);
  }
  async getUser(query: FilterQuery<UserDocument>): Promise<User> {
    const user = await this.userModel.findOne(query);
    if (!user) return undefined;
    return user;
  }
}
