import { Injectable } from '@nestjs/common';
import { OpenaiService } from 'src/openai/openai.service';
import { searchProducts } from './tools/search-products';

@Injectable()
export class ChatbotService {
  constructor(private readonly openaiService: OpenaiService) {}

  async handleQuery(query: string): Promise<string> {
    const result = await this.openaiService.askWithToolCalling(query);

    const toolCall = result.tool_calls?.[0];

    if (toolCall && toolCall.function?.name) {
      const functionName = toolCall.function.name;
      const args = JSON.parse(toolCall.function.arguments || '{}');
      const toolCallId = toolCall.id;

      let functionResult: any;

      if (functionName === 'searchProducts') {
        functionResult = await searchProducts(args.query);
      } else if (functionName === 'convertCurrencies') {
        functionResult = { message: 'Currency conversion not implemented yet' };
      } else {
        return `Tool ${functionName} not recognized.`;
      }

      const finalResponse = await this.openaiService.completeToolResult(
        query,
        toolCall, 
        functionResult,
      );

      return finalResponse.content ?? 'No response generated.';
    }

    return result.content || 'No tool call or message returned.';
  }
}
