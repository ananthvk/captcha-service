import { Module } from '@nestjs/common';
import { CaptchaModule } from './captcha/captcha.module';
import { ImageGenModule } from './image-gen/image-gen.module';
import { KvstoreModule } from './kvstore/kvstore.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [CaptchaModule, ImageGenModule, KvstoreModule, ConfigModule.forRoot({ isGlobal: true })],
})
export class AppModule { }
