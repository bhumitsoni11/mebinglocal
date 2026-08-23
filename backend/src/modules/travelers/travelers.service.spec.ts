import { Test, TestingModule } from '@nestjs/testing';
import { TravelersService } from './travelers.service';

describe('TravelersService', () => {
  let service: TravelersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TravelersService],
    }).compile();

    service = module.get<TravelersService>(TravelersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
