import { Test, TestingModule } from '@nestjs/testing';
import { KvstoreService } from './kvstore.service';

describe('KvstoreService', () => {
  let service: KvstoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KvstoreService],
    }).compile();

    service = module.get<KvstoreService>(KvstoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
