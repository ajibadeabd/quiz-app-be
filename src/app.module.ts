import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuizModule } from './quiz/quiz.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserModule,
    QuizModule,
    MongooseModule.forRoot('mongodb://localhost/nest'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
