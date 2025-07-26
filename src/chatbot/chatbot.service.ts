import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatbotService {
  async handleQuery(query: string): Promise<string> {
    console.log('User query:', query);

    return `Placeholder response for: ${query}`;
  }
}
