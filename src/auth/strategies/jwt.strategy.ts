import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { jwtConstants } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: {
    id: string;
    email: string;
    iat: number;
    exp: number;
  }) {
    if (!payload) throw new UnauthorizedException();
    const user = await this.userService.getUser({ _id: payload.id });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
