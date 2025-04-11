import { Test, TestingModule } from '@nestjs/testing';
import { ImageGenService } from './image-gen.service';
import { ConfigService } from '@nestjs/config';

describe('ImageGenService', () => {
    let service: ImageGenService;

    const mockConfigService = {
        get: jest.fn((key: string) => {
            const values = {
                'CAPTCHA_WIDTH': '50',
                'CAPTCHA_HEIGHT': '25',
                'CAPTCHA_DEFAULT_FONT': 'Arial',
                'CAPTCHA_DEFAULT_FONT_SIZE': '5'
            }
            return values[key]
        })
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ImageGenService, {
                provide: ConfigService,
                useValue: mockConfigService
            }],
        }).compile();

        service = module.get<ImageGenService>(ImageGenService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should generate a captcha image', async () => {
        const { width, height, image } = await service.createChallengeImage("hello")
        expect(width).toBe(50)
        expect(height).toBe(25)
        expect(image).not.toBe('')
    })
});
