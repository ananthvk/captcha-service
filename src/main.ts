import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1',
        prefix: 'api/v'
    })

    const config = new DocumentBuilder()
        .setTitle('Captcha service')
        .setDescription('A self hosted REST api solution to generate simple image captchas')
        .setVersion('1.0')
        .addTag('captcha')
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('docs', app, documentFactory, {
        jsonDocumentUrl: 'docs/json',
    });

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
