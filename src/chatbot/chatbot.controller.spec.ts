import { Test, TestingModule } from '@nestjs/testing';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';
import { UseryQueryDto } from './dto/user-query.dto';

describe('ChatbotController', () => {
  let controller: ChatbotController;
  let mockChatbotService: Partial<ChatbotService>;

  beforeEach(async () => {
    mockChatbotService = {
      handleQuery: jest.fn().mockResolvedValue('Mocked assistant response'),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatbotController],
      providers: [
        {
          provide: ChatbotService,
          useValue: mockChatbotService,
        },
      ],
    }).compile();

    controller = module.get<ChatbotController>(ChatbotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return response from ChatbotService', async () => {
    const dto: UseryQueryDto = { query: 'Tell me a joke' };

    const result = await controller.handleUserQuery(dto);

    expect(result).toEqual({ response: 'Mocked assistant response' });
    expect(mockChatbotService.handleQuery).toHaveBeenCalledWith('Tell me a joke');
  });
});
