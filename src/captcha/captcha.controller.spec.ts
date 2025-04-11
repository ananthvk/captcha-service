import { Test, TestingModule } from '@nestjs/testing';
import { CaptchaController } from './captcha.controller';
import { CaptchaService } from './captcha.service';
import { ImageGenService } from 'src/image-gen/image-gen.service';
import { ConfigService } from '@nestjs/config';
import { KvstoreService } from 'src/kvstore/kvstore.service';

describe('CaptchaController', () => {
    let controller: CaptchaController;
    let service: CaptchaService

    const mockImageGenService = { createChallengeImage: jest.fn() };
    const mockConfigService = { get: jest.fn() };
    const mockKvstoreService = { get: jest.fn(), set: jest.fn() };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CaptchaController],
            providers: [
                CaptchaService,
                { provide: ImageGenService, useValue: mockImageGenService },
                { provide: ConfigService, useValue: mockConfigService },
                { provide: KvstoreService, useValue: mockKvstoreService },
            ],
        }).compile();

        controller = module.get<CaptchaController>(CaptchaController);
        service = module.get<CaptchaService>(CaptchaService)
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should generate captcha', async () => {
        jest.spyOn(service, 'generateImageCaptcha').mockImplementation(
            async () => { return { id: 'abc', image: { width: 20, height: 15, image: 'base64' } } }
        )

        const result = await controller.generate({ category: 'image' })
        expect(result.id).not.toBeUndefined()
        expect(result.image).toBe('base64')
    })
});
