import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatbotModule } from './chatbot/chatbot.module';
import { OpenaiModule } from './openai/openai.module';

@Module({
  imports: [ChatbotModule, OpenaiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
