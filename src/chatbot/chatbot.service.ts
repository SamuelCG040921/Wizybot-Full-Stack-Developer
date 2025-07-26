import { Injectable } from '@nestjs/common';
import { OpenaiService } from 'src/openai/openai.service';
import { searchProducts } from './tools/search-products';
import { convertCurrencies } from './tools/convert-currencies';

@Injectable()
export class ChatbotService {
  constructor(private readonly openaiService: OpenaiService) {}

  async handleQuery(query: string): Promise<string> {
    const result = await this.openaiService.askWithToolCalling(query);

    const toolCall = result.tool_calls?.[0];

    if (toolCall && toolCall.function?.name) {

      const functionName = toolCall.function.name;
      let args: any = {};

      try {
        args =
          typeof toolCall.function.arguments === 'string'
            ? JSON.parse(toolCall.function.arguments)
            : toolCall.function.arguments;
      } catch (e) {
        console.error(
          '❌ Error parsing arguments:',
          toolCall.function.arguments,
        );
        throw new Error('Invalid function arguments received from OpenAI.');
      }

      const toolCallId = toolCall.id;

      let functionResult: any;

      if (functionName === 'searchProducts') {
        functionResult = await searchProducts(args.query);
      } else if (functionName === 'convertCurrencies') {
        functionResult = await convertCurrencies(
          args.amount,
          args.fromCurrency,
          args.toCurrency,
        );
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
