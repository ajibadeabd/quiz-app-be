import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

export type QuizTakenDocument = QuizTaken & Document;

@Schema({
  id: true,
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class QuizTaken {
  @Prop({
    type: Boolean,
    default: false,
  })
  completed: boolean;

  @Prop({
    type: String,
    ref: 'User',
  })
  user: string;

  @Prop({
    type: String,
  })
  quizCode: string;

  @Prop({
    type: Object,
    default: {},
  })
  answers: object;
}

export const QuizTakenSchema = SchemaFactory.createForClass(QuizTaken);
