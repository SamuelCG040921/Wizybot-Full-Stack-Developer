import { Test, TestingModule } from '@nestjs/testing';
import { OpenaiService } from './openai.service';
import OpenAI from 'openai';

jest.mock('openai');

describe('OpenaiService', () => {
  let service: OpenaiService;
  let mockCreate: jest.Mock;

  beforeEach(async () => {
    // Mock OpenAI.chat.completions.create
    mockCreate = jest.fn();

    (OpenAI as any).mockImplementation(() => ({
      chat: {
        completions: {
          create: mockCreate,
        },
      },
    }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenaiService],
    }).compile();

    service = module.get<OpenaiService>(OpenaiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call OpenAI with tool_calls in askWithToolCalling', async () => {
    // Arrange: mock OpenAI response
    mockCreate.mockResolvedValue({
      choices: [
        {
          message: {
            role: 'assistant',
            content: null,
            tool_calls: [
              {
                id: 'tool_123',
                function: {
                  name: 'searchProducts',
                  arguments: '{"query":"phone"}',
                },
              },
            ],
          },
        },
      ],
    });

    // Act
    const result = await service.askWithToolCalling('Find me a phone');

    // Assert
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'gpt-3.5-turbo',
        messages: expect.any(Array),
        tools: expect.any(Array),
        tool_choice: 'auto',
      }),
    );

    expect(result.tool_calls?.[0].function.name).toBe('searchProducts');
  });

  it('should generate a final message using completeToolResult', async () => {
    // Arrange: tool_call and result
    const toolCall = {
      id: 'tool_xyz',
      function: {
        name: 'searchProducts',
        arguments: '{"query":"phone"}',
      },
      type: 'function',
    };

    mockCreate.mockResolvedValue({
      choices: [
        {
          message: {
            role: 'assistant',
            content: 'Here are some phones...',
          },
        },
      ],
    });

    // Act
    const response = await service.completeToolResult(
      'Find me a phone',
      toolCall as any,
      [{ title: 'iPhone 13' }],
    );

    // Assert
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: expect.arrayContaining([
          expect.objectContaining({ role: 'tool', tool_call_id: 'tool_xyz' }),
        ]),
      }),
    );
    expect(response.content).toBe('Here are some phones...');
  });
});
