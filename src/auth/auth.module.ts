import { Module } from '@nestjs/common';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UserModule } from 'src/user/user.module';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { jwtConstants } from './constants';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/entity/user.schema';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        signOptions: {
          expiresIn: '366d',
        },
        secret: jwtConstants.secret,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, AuthService],
})
export class AuthModule {}
