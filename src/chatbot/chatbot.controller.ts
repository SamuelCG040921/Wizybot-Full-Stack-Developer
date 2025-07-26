import { Body, Controller, Post } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { UseryQueryDto } from './dto/user-query.dto';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post()
  async handleUserQuery(
    @Body() userQueryDto: UseryQueryDto,
  ): Promise<{ response: string }> {
    const response = await this.chatbotService.handleQuery(userQueryDto.query);
    return { response };
  }
}
