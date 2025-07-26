import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

@Injectable()
export class OpenaiService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async askWithToolCalling(
    userQuery: string,
  ): Promise<OpenAI.Chat.Completions.ChatCompletionMessage> {
    const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
      {
        type: 'function',
        function: {
          name: 'searchProducts',
          description: 'Search relevant products in the catalog',
          parameters: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description:
                  "What the user is looking for (e.g., 'phone', 'gift for dad')",
              },
            },
            required: ['query'],
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'convertCurrencies',
          description: 'Convert an amount from one currency to another',
          parameters: {
            type: 'object',
            properties: {
              amount: { type: 'number' },
              fromCurrency: { type: 'string' },
              toCurrency: { type: 'string' },
            },
            required: ['amount', 'fromCurrency', 'toCurrency'],
          },
        },
      },
    ];

    const chatResponse = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are an assistant that can use tools like searchProducts and convertCurrencies.',
        },
        {
          role: 'user',
          content: userQuery,
        },
      ],
      tools,
      tool_choice: 'auto',
    });

    return chatResponse.choices[0].message;
  }

  async completeToolResult(
    userQuery: string,
    toolCall: OpenAI.Chat.Completions.ChatCompletionMessageToolCall,
    toolResult: any,
  ): Promise<OpenAI.Chat.Completions.ChatCompletionMessage> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are an assistant that can use tools like searchProducts and convertCurrencies.',
        },
        { role: 'user', content: userQuery },
        {
          role: 'assistant',
          tool_calls: [toolCall], // 👈 este es el mensaje anterior que causaba el 400 si faltaba
        },
        {
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(toolResult),
        },
      ],
    });

    return response.choices[0].message;
  }
}
