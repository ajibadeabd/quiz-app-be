import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QuizDocument, Quiz } from './entity/quiz.schema';
import { IQuiz } from './interface';

@Injectable()
export class QuizService {
  constructor(
    @InjectModel(Quiz.name)
    private quizModel: Model<QuizDocument>,
  ) {}
  createQuiz(data: IQuiz, owner: string): Promise<Quiz> {
    return this.quizModel.create({ ...data, owner });
  }
  getQuiz(quizCode: string): Promise<Quiz> {
    return this.quizModel.findOne({ quizCode }).then((res) => {
      if (!res) {
        throw new HttpException('quiz not found', 404);
      }
      return res;
    });
  }

  getQuizzes(owner: string): Promise<Quiz[]> {
    return this.quizModel.find({ owner }).exec();
  }
}
