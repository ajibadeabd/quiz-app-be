import { Controller, Post, Body, Get, Req } from '@nestjs/common';
import { User, UserDocument } from './entity/user.schema';
import { IUser } from './interface';
import { UserService } from './user.service';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body() body: IUser): Promise<User> {
    return this.userService.createUser(body);
  }
  @Get()
  getUser(@Req() request: Request & { user: UserDocument }): Promise<User> {
    return this.userService.getUser({ _id: request.user._id });
  }
}
