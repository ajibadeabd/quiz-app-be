import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from 'src/auth/guards/admin-auth.guard.ts';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Quiz } from './entity/quiz.schema';
import { getQuizParams, IQuiz } from './interface';
import { QuizService } from './quiz.service';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/:quizCode')
  startQuiz(@Param() data: getQuizParams, @Req() request): Promise<Quiz> {
    return this.quizService.startQuiz(data.quizCode, request.user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/submit')
  submitQuiz(@Body() data, @Req() request) {
    return this.quizService.submitQuiz(data, request.user._id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('/')
  getAllQuiz(@Req() request): Promise<Quiz[]> {
    return this.quizService.getQuizzes(request.user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  createQuiz(@Body() data: IQuiz, @Req() request): Promise<Quiz> {
    return this.quizService.createQuiz(data, request.user._id);
  }
}
