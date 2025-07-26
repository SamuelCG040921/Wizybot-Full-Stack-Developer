import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { UseryQueryDto } from './dto/user-query.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  /**
   * POST /chatbot
   * 
   * Accepts a user query and returns an AI-generated response.
   * Internally, this may trigger tools like searchProducts or convertCurrencies.
   */
  @Post()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Ask a question to the assistant',
    description:
      'This endpoint allows users to interact with the AI assistant. Internally, it may invoke tools such as product search or currency conversion.',
  })
  @ApiBody({
    description: 'User query input',
    type: UseryQueryDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Successful assistant response',
    schema: {
      example: {
        response:
          'I found some phones for you:\n\n1. iPhone 13\n   - Price: $1099.0 USD\n   - [Link](...)',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request (e.g. malformed JSON or missing parameters)',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid function arguments received from OpenAI.',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description:
      'Internal server error (e.g. API failure or unexpected exception)',
    schema: {
      example: {
        statusCode: 500,
        message: 'Unexpected error occurred while processing request.',
      },
    },
  })
  async handleUserQuery(
    @Body() userQueryDto: UseryQueryDto,
  ): Promise<{ response: string }> {
    const response = await this.chatbotService.handleQuery(userQueryDto.query);
    return { response };
  }
}
