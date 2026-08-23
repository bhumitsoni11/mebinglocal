import { Test, TestingModule } from '@nestjs/testing';
import { LocalPulseController } from './local-pulse.controller';

describe('LocalPulseController', () => {
  let controller: LocalPulseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocalPulseController],
    }).compile();

    controller = module.get<LocalPulseController>(LocalPulseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
