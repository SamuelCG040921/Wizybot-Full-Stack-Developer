import { Injectable } from '@nestjs/common';
import { OpenaiService } from 'src/openai/openai.service';
import { searchProducts } from './tools/search-products';
import { convertCurrencies } from './tools/convert-currencies';

@Injectable()
export class ChatbotService {
  constructor(private readonly openaiService: OpenaiService) {}

  /**
   * Handles a user query by interacting with the OpenAI API.
   * If the assistant chooses to use a tool (via tool_call), this method
   * executes the tool and sends the result back to OpenAI to generate a final response.
   *
   * @param query - User's natural language input
   * @returns Final assistant message as a string
   */
  async handleQuery(query: string): Promise<string> {
    // Step 1: Send the user's query to OpenAI and let it decide if it needs a tool
    const result = await this.openaiService.askWithToolCalling(query);

    const toolCall = result.tool_calls?.[0];

    // Step 2: If a tool_call is returned, extract and parse its arguments
    if (toolCall && toolCall.function?.name) {
      const functionName = toolCall.function.name;
      let args: any = {};

      try {
        // Parse tool arguments (they arrive as JSON string from OpenAI)
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

      // Step 3: Execute the corresponding tool function
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

      // Step 4: Send the tool result back to OpenAI for a final assistant response
      const finalResponse = await this.openaiService.completeToolResult(
        query,
        toolCall,
        functionResult,
      );

      return finalResponse.content ?? 'No response generated.';
    }

    // Step 5: If no tool_call, return the assistant's original response
    return result.content || 'No tool call or message returned.';
  }
}
