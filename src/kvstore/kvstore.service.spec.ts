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

    it('check set, and get', async () => {
        // Check insertion
        await service.set('keys', 'hello')
        let result = await service.get('keys')
        expect(result).toBe('hello')

        // Check updation
        await service.set('keys', 'hello world')
        result = await service.get('keys')
        expect(result).toBe('hello world')

        // Get a key which does not exist
        result = await service.get('non existant key')
        expect(result).toBeUndefined()
    })

    it('check delete, clear', async () => {
        await service.set('hello', 'world')
        await service.set('nest', 'js')
        await service.set('git', 'hub')

        expect(await service.get('hello')).toBe('world')
        await service.delete('hello')
        expect(await service.get('hello')).toBeUndefined()
        expect(await service.get('nest')).toBe('js')
        expect(await service.get('git')).toBe('hub')

        await service.clear()
        expect(await service.get('hello')).toBeUndefined()
        expect(await service.get('nest')).toBeUndefined()
        expect(await service.get('git')).toBeUndefined()
    })

    it('check set with ttl', async () => {
        await service.set('hello', 'world', { ttl: 1 })
        expect(await service.get('hello')).toBe('world')

        await new Promise(x => setTimeout(x, 1500));
        expect(await service.get('hello')).toBeUndefined()
    })
});
