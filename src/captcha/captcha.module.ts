import { Module } from '@nestjs/common';
import { CaptchaService } from './captcha.service';
import { CaptchaController } from './captcha.controller';
import { ImageGenModule } from 'src/image-gen/image-gen.module';
import { KvstoreModule } from 'src/kvstore/kvstore.module';

@Module({
    imports: [ImageGenModule, KvstoreModule],
    providers: [CaptchaService],
    controllers: [CaptchaController]
})
export class CaptchaModule { }
