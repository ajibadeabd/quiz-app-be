import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { IUser, TokenisedUser } from 'src/user/interface';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signUp')
  createUser(@Body() body: IUser): Promise<TokenisedUser> {
    return this.authService.createUser(body);
  }

  @Post('signIn')
  login(@Body() body: IUser): Promise<TokenisedUser> {
    return this.authService.login(body);
  }
}
