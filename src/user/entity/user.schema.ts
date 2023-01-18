import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';

import { Document, Schema as mongooseSchema } from 'mongoose';
import * as bcrypt from 'bcrypt';
export type UserDocument = User & Document;

@Schema({
  id: true,
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class User {
  @Prop()
  name: string;

  @Prop({ select: false })
  password: string;

  @Prop({
    type: mongooseSchema.Types.ObjectId,
    ref: 'Quiz',
    required: false,
    default: [],
  })
  createdQuiz: [string];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  (this as any).updatedAt = Date.now();
  if (this.isModified('password')) {
    // Hash the password before it is saved.
    const salt = await bcrypt.genSalt(10);
    const pwHash = await bcrypt.hash((this as any).password, salt);
    (this as any).password = pwHash;
  }
  next();
});
