import { ApiProperty } from '@nestjs/swagger';
import { min, IsNotEmpty, Length } from 'class-validator';
import { User } from '../entity/user.schema';

export class IUser {
  @ApiProperty()
  @IsNotEmpty()
  @Length(3)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(3)
  password: string;
}

export class TokenisedUser {
  @ApiProperty()
  token: string;

  @ApiProperty()
  user: User;
}
