import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsArray,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';

export class IQuestion {
  @ApiProperty()
  @IsNotEmpty()
  question: string;

  @ApiProperty()
  @IsNotEmpty()
  firstOption: string;

  @ApiProperty()
  @IsNotEmpty()
  secondOption: string;

  @ApiProperty()
  @IsNotEmpty()
  thirdOption: string;

  @ApiProperty()
  @IsNotEmpty()
  fourthOption: string;

  @ApiProperty()
  @IsNumber()
  point: string;

  @ApiProperty()
  @IsNotEmpty()
  correctAnswer: string;
}

export class IQuiz {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNumber()
  duration: number;

  @ApiProperty({
    type: Array<IQuestion>,
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IQuestion)
  @IsArray()
  @ArrayMinSize(2)
  questions: [IQuestion];
}

export class getQuizParams {
  @ApiProperty()
  @IsNotEmpty()
  quizCode: string;
}
