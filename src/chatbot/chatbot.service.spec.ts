import { Test, TestingModule } from '@nestjs/testing';
import { ChatbotService } from './chatbot.service';
import { OpenaiService } from '../openai/openai.service';
import * as tools from './tools/search-products';

describe('ChatbotService', () => {
  let service: ChatbotService;
  let mockOpenaiService: Partial<OpenaiService>;

  beforeEach(async () => {
    // Mock OpenAI tool call response
    mockOpenaiService = {
      askWithToolCalling: jest.fn().mockResolvedValue({
        tool_calls: [
          {
            id: 'call_1',
            function: {
              name: 'searchProducts',
              arguments: JSON.stringify({ query: 'phone' }),
            },
          },
        ],
      }),
      completeToolResult: jest.fn().mockResolvedValue({
        content: 'Mocked final assistant response',
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatbotService,
        {
          provide: OpenaiService,
          useValue: mockOpenaiService,
        },
      ],
    }).compile();

    service = module.get<ChatbotService>(ChatbotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should handle a tool_call to searchProducts and return final response', async () => {
    // Mock the tool function used by the service
    jest.spyOn(tools, 'searchProducts').mockResolvedValue([
      {
        title: 'iPhone 13',
        price: '1099',
        category: 'smartphones',
        description: 'Latest Apple iPhone',
        imageUrl: 'https://example.com/iphone-13.jpg',
        url: 'https://example.com/iphone-13',
      },
    ]);

    const result = await service.handleQuery('I am looking for a phone');

    expect(result).toBe('Mocked final assistant response');
    expect(mockOpenaiService.askWithToolCalling).toHaveBeenCalledWith(
      'I am looking for a phone',
    );
    expect(mockOpenaiService.completeToolResult).toHaveBeenCalledWith(
      'I am looking for a phone',
      expect.any(Object),
      [
        {
          title: 'iPhone 13',
          price: '1099',
          category: 'smartphones',
          description: 'Latest Apple iPhone',
          imageUrl: 'https://example.com/iphone-13.jpg',
          url: 'https://example.com/iphone-13',
        },
      ],
    );
  });
});
