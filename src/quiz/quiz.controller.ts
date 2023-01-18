import { Controller, Get } from '@nestjs/common';
import { QuizService } from './quiz.service';

@Controller()
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get()
  getQuiz(): string {
    return this.quizService.getHello();
  }
  @Get()
  getAllQuiz(): string {
    return this.quizService.getHello();
  }
  @Get()
  createQuiz(): string {
    return this.quizService.getHello();
  }
  @Get()
  deleteQuiz(): string {
    return this.quizService.getHello();
  }
}
