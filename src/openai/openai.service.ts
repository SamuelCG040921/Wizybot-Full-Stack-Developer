import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

/**
 * Service to interact with OpenAI's Chat Completion API using Function Calling.
 */
@Injectable()
export class OpenaiService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Sends a user query to OpenAI and lets the model choose a function to call.
   * @param userQuery - The user's natural language question.
   * @returns A message object from OpenAI, possibly including a function_call.
   */
  async askWithFunctionCalling(
    userQuery: string,
  ): Promise<OpenAI.Chat.Completions.ChatCompletionMessage> {
    const functions = [
      {
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
      {
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
    ];

    const chatResponse = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo-0613',
      messages: [
        {
          role: 'system',
          content:
            'You are an assistant that can use functions like searchProducts and convertCurrencies.',
        },
        {
          role: 'user',
          content: userQuery,
        },
      ],
      functions,
      function_call: 'auto',
    });

    return chatResponse.choices[0].message;
  }
}
