import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { User, UserDocument } from './entity/user.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}
  async getUser(query: FilterQuery<UserDocument>): Promise<User> {
    const user = await this.userModel.findOne(query);
    if (!user) return undefined;
    return user;
  }

  async _getUser(query: FilterQuery<UserDocument>): Promise<User> {
    const user = this.getUser(query);
    if (!user) throw new HttpException('no user found', 404);
    return user;
  }
}
