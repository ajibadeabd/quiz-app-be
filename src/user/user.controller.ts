import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { User, UserDocument } from './entity/user.schema';
import { UserService } from './user.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getUser(@Req() request: Request & { user: UserDocument }): Promise<User> {
    return this.userService._getUser({ _id: request.user._id });
  }
}
