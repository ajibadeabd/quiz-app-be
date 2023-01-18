import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';
import { IQuestion } from '../interface';

export type QuizDocument = Quiz & Document;

@Schema()
export class Quiz {
  @Prop()
  name: string;

  @Prop({
    type: Array<IQuestion>,
    required: true,
  })
  questions: [IQuestion];

  @Prop({
    type: String,
    ref: 'User',
  })
  owner: string;

  @Prop({
    type: Number,
  })
  duration: number;
  @Prop({
    type: String,
  })
  quizCode: string;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
