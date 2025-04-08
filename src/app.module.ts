import { Module } from '@nestjs/common';
import { CaptchaModule } from './captcha/captcha.module';
import { ImageGenModule } from './image-gen/image-gen.module';

@Module({
  imports: [CaptchaModule, ImageGenModule],
})
export class AppModule {}
