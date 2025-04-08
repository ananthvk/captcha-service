import { BadRequestException, Body, Controller, NotImplementedException, Post, ValidationPipe } from '@nestjs/common';
import { GenerateCaptchaDto } from './dto/generate-captcha.dto';
import { VerifyCaptchaDto } from './dto/verify-captcha.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GenerateCaptchaResponseDto } from './dto/generate-captcha-response.dto';
import { CaptchaService } from './captcha.service';



type VerifyCaptchaResponseSuccess = {
    status: "success"
}
type VerifyCaptchaResponseError = {
    status: "error"
    errors: string[]
}
type VerifyCaptchaResponse = VerifyCaptchaResponseSuccess | VerifyCaptchaResponseError;

@Controller('captcha')
export class CaptchaController {
    constructor(private readonly captchaService: CaptchaService) {
    }

    @Post('generate')
    @ApiOperation({ summary: 'Generates a new captcha and a challenge, to be called on the client', description: 'The client sends the category of captcha it requires. The response contains an UUID, that uniquely identifies the captcha. It also contains the captcha category - image or audio, and the captcha challenge. This route should be called on the client device, for example on the browser.' })
    @ApiResponse({
        status: 200,
        description: 'Successfully generated captcha',
        type: GenerateCaptchaResponseDto
    })
    async generate(@Body(ValidationPipe) generateCaptchaDto: GenerateCaptchaDto): Promise<GenerateCaptchaResponseDto> {
        if (generateCaptchaDto.category === 'audio')
            throw new NotImplementedException('Audio captchas are not yet implemented')
        if (generateCaptchaDto.category === 'image')
            return {
                id: '9f93f89a-26ec-4a67-928a-3a61c5ce77a6',
                category: 'image',
                image: await this.captchaService.generateCaptcha(),
                width: 200,
                height: 100,
            }
    }

    @Post('verify')
    @ApiOperation({ summary: 'Verifies if the captcha solution is valid, to be called on the server', description: 'Verifies if the captcha id provided and the solution matches. This route should be called on the server to validate the captcha.' })
    async verify(@Body(ValidationPipe) verifyCaptchaDto: VerifyCaptchaDto): Promise<VerifyCaptchaResponse> {
        if (verifyCaptchaDto.solution === "hello")
            return {
                status: "success"
            }
        else
            return {
                status: "error",
                errors: ["Invalid solution"]
            }
    }
}
