import { Test, TestingModule } from '@nestjs/testing';
import { LocalPulseService } from './local-pulse.service';

describe('LocalPulseService', () => {
  let service: LocalPulseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocalPulseService],
    }).compile();

    service = module.get<LocalPulseService>(LocalPulseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
