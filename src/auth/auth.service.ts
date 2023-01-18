import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { IUser, TokenisedUser } from 'src/user/interface';
import { UserDocument, User } from 'src/user/entity/user.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}
  async login(body: IUser): Promise<TokenisedUser> {
    const user = await this.userService.getUser({ name: body.name });
    if (!user) {
      throw new HttpException('no user found', 400);
    }
    const token = this.generateToken(user);
    return { user, token };
  }
  async createUser(body: IUser): Promise<TokenisedUser> {
    const isUserExist = await this.userService.getUser({ name: body.name });
    if (isUserExist) {
      throw new HttpException('username taken', 400);
    }
    const user = await this.userModel.create(body);

    const token = this.generateToken(user);

    delete user.password;
    delete user.name;
    return { user, token };
  }

  private generateToken(user): string {
    const payload = { id: user._id, email: user.name };
    return this.jwtService.sign(payload);
  }
}
