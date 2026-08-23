import { Test, TestingModule } from '@nestjs/testing';
import { AssistantService } from './assistant.service';
import { OpenaiService } from '../../openai/openai.service';
import { PrismaService } from '../../../common/database/prisma.service';

describe('AssistantService', () => {
  let service: AssistantService;
  let openaiService: jest.Mocked<OpenaiService>;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const mockOpenaiService = {
      generateCompletion: jest.fn(),
    };

    const mockPrismaService = {
      user: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssistantService,
        { provide: OpenaiService, useValue: mockOpenaiService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AssistantService>(AssistantService);
    openaiService = module.get(OpenaiService);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should format context and call openai correctly', async () => {
    (prismaService.user.findUnique as jest.Mock).mockResolvedValue({
      id: 'user-1',
      travelerProfile: {
        travelStyle: 'Relaxed',
        interests: [{ interest: { name: 'Food' } }],
        languages: []
      }
    });

    openaiService.generateCompletion.mockResolvedValue('Mock response');

    const result = await service.handleQuery('user-1', 'What should I eat?');

    expect(prismaService.user.findUnique).toHaveBeenCalledWith(expect.any(Object));
    expect(openaiService.generateCompletion).toHaveBeenCalled();
    expect(result.response).toEqual('Mock response');
  });
});
