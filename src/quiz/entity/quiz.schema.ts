import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';
import { IQuestion } from '../interface';

export type QuizDocument = Quiz & Document;

@Schema({
  id: true,
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class Quiz {
  @Prop()
  name: string;

  @Prop({
    // type: Array<IQuestion & { id: string }>,
    type: Array<object>,
    required: true,
  })
  questions: any;

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
