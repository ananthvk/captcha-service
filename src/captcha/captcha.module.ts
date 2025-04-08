import { Module } from '@nestjs/common';
import { CaptchaService } from './captcha.service';
import { CaptchaController } from './captcha.controller';
import { ImageGenModule } from 'src/image-gen/image-gen.module';

@Module({
    imports: [ImageGenModule],
    providers: [CaptchaService],
    controllers: [CaptchaController]
})
export class CaptchaModule { }
