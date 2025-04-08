import { IsEnum, IsNotEmpty } from "class-validator";

export class GenerateCaptchaDto {
    @IsEnum(['image', 'audio'], {
        message: 'Valid captcha category required'
    })
    @IsNotEmpty()
    category: 'image' | 'audio'
};