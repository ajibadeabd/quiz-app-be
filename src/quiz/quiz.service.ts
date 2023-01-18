import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { QuizDocument, Quiz } from './entity/quiz.schema';
import { QuizTaken, QuizTakenDocument } from './entity/quizTaken.schema';
import { IQuestion, IQuiz } from './interface';
import { generateQuizCode } from './quiz.util';

@Injectable()
export class QuizService {
  constructor(
    @InjectModel(Quiz.name)
    private quizModel: Model<QuizDocument>,
    @InjectModel(QuizTaken.name)
    private quizTaken: Model<QuizTakenDocument>,
  ) {}
  createQuiz(data: IQuiz, owner: string): Promise<Quiz> {
    const quizCode = generateQuizCode();
    data.questions = data.questions.map((question) => {
      return {
        ...question,
        id: String(new Types.ObjectId()),
      };
    });
    return this.quizModel.create({ ...data, owner, quizCode });
  }
  getQuiz(quizCode: string, exclude = ''): Promise<QuizDocument> {
    return this.quizModel.findOne({ quizCode }, exclude).then((res) => {
      if (!res) {
        throw new HttpException('invalid code', 404);
      }
      return res;
    });
  }
  async submitQuiz(data, userId) {
    const { quizCode, answers } = data;
    const quiz = await this.getQuiz(quizCode);
    const isQuizTaken = await this.getQuizTaken({ quizCode, user: userId });

    if (!isQuizTaken) {
      throw new HttpException('unauthorized', 400);
    }
    if (isQuizTaken?.completed) {
      throw new HttpException('Quiz already completed', 400);
    }
    await this.isQuizTimeOut(isQuizTaken, quiz);

    const formattedAnswers = answers.reduce((prev, currentValue) => {
      prev[currentValue.questionId] = currentValue;
      return prev;
    }, {});
    const { correctAnswer, point } = this.getCorrectAnswer(
      formattedAnswers,
      quiz,
    );

    const quizPoint = quiz.questions.reduce((a: number, b) => a + b.point, 0);

    const response = {
      answers: {
        data: Object.values(correctAnswer),
        totalPoint: quizPoint,
        point,
      },
    };

    await this.quizTaken.findOneAndUpdate(
      {
        quizCode,
        user: userId.toString(),
      },
      {
        completed: true,
        ...response,
      },
    );

    return response;
  }

  async startQuiz(quizCode: string, userId): Promise<Quiz> {
    const quiz = await this.getQuiz(quizCode, '-questions.correctAnswer');

    const isQuizTaken = await this.getQuizTaken({ quizCode, user: userId });
    console.log({ isQuizTaken });
    if (!isQuizTaken) {
      this.quizTaken.create({
        user: userId,
        quizCode,
      });
      return this.getQuiz(quizCode);
    }

    if (isQuizTaken?.completed) {
      throw new HttpException('Quiz already completed', 400);
    }
    await this.isQuizTimeOut(isQuizTaken, quiz);

    return quiz;
  }

  getQuizzes(owner: string): Promise<Quiz[]> {
    return this.quizModel.find({ owner }).exec();
  }

  private getCorrectAnswer(formattedAnswers, quiz: Quiz) {
    let point = 0;
    const option = {
      A: 'firstOption',
      B: 'secondOption',
      C: 'thirdOption',
      D: 'fourthOption',
    };
    const correctAnswer = quiz.questions.reduce(
      (prev, currentValue: IQuestion & { id: string }) => {
        if (formattedAnswers[currentValue.id]) {
          prev[currentValue.id]['question'] = currentValue.question;
          prev[currentValue.id]['correctAnswer'] = currentValue.correctAnswer;
          prev[currentValue.id]['selectedAnswer'] =
            currentValue[prev[currentValue.id].answer];
          prev[currentValue.id]['status'] =
            option[currentValue.correctAnswer] == prev[currentValue.id].answer
              ? 'correct'
              : 'wrong';
          prev[currentValue.id]['correctAnswer'] =
            currentValue[option[currentValue.correctAnswer]];
          if (prev[currentValue.id]['status'] === 'correct') {
            point += currentValue.point;
          }
          delete prev[currentValue.id].questionId;
          delete prev[currentValue.id].answer;
        }
        return prev;
      },
      formattedAnswers,
    );
    return { correctAnswer, point };
  }
  private async isQuizTimeOut(isQuizTaken, quiz: Quiz) {
    console.log(isQuizTaken);
    const quizTime = quiz.duration * 1000;
    const timeStarted = new Date(isQuizTaken.createdAt).getTime();
    if (timeStarted + quizTime < Date.now()) {
      throw new HttpException('Quiz time out', 400);
    }
    return;
  }

  private getQuizTaken(quiz): Promise<QuizTakenDocument> {
    return this.quizTaken.findOne({ ...quiz }).exec();
  }
}
