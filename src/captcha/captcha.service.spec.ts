import { Test, TestingModule } from '@nestjs/testing';
import { CaptchaService } from './captcha.service';
import { ConfigService } from '@nestjs/config';
import { KvstoreModule } from 'src/kvstore/kvstore.module';
import { ImageGenService } from 'src/image-gen/image-gen.service';
import { KvstoreService } from 'src/kvstore/kvstore.service';

describe('CaptchaService', () => {
    let service: CaptchaService;
    let kvService: KvstoreService;

    const mockConfigService = {
        get: jest.fn((key: string) => {
            const values = {
                'CAPTCHA_WORD_SIZE': '6',
                'CAPTCHA_TTL': '5',
                'CAPTCHA_LETTERS': 'hijk123'
            }
            return values[key]
        })
    }

    const mockImageGenService = {
        createChallengeImage: jest.fn(async (solution: string) => {
            // Return the captcha solution as the image in this mock
            return { width: 20, height: 10, image: solution }
        })
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [KvstoreModule],
            providers: [
                CaptchaService,
                {
                    provide: ConfigService,
                    useValue: mockConfigService
                },
                {
                    provide: ImageGenService,
                    useValue: mockImageGenService
                }
            ],
        }).compile();

        service = module.get<CaptchaService>(CaptchaService);
        kvService = module.get<KvstoreService>(KvstoreService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should generate a captcha, and be able to verify it', async () => {
        const { id, image } = await service.generateImageCaptcha()
        expect(id).not.toBe('')
        expect(id).not.toBeUndefined()
        expect(image.width).toBe(20)
        expect(image.height).toBe(10)
        expect(image.image).not.toBeUndefined()

        expect(await service.verifyCaptcha(id, image.image)).toBe(true)
    })

    it('should not allow duplicate captchas to be verified', async () => {
        const { id, image } = await service.generateImageCaptcha()
        expect(await service.verifyCaptcha(id, image.image)).toBe(true)
        // verification should only work once
        expect(await service.verifyCaptcha(id, image.image)).toBe(false)
    })

    it('should return false if captcha is invalid', async () => {
        const { id, image } = await service.generateImageCaptcha()
        expect(await service.verifyCaptcha(id, image.image + 'x')).toBe(false)

        // Also check if the captcha is use once
        expect(await service.verifyCaptcha(id, image.image)).toBe(false)
    })

    it('should return false for non existent id', async () => {
        const { id, image } = await service.generateImageCaptcha()
        expect(await service.verifyCaptcha(id + 'x', image.image)).toBe(false)
    })

});
