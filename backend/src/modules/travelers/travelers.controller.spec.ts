import { Test, TestingModule } from '@nestjs/testing';
import { TravelersController } from './travelers.controller';

describe('TravelersController', () => {
  let controller: TravelersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TravelersController],
    }).compile();

    controller = module.get<TravelersController>(TravelersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
