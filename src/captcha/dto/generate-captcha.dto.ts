import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

@ApiSchema({ name: 'GenerateCaptchaRequest' })
export class GenerateCaptchaDto {
    @ApiProperty({example: 'image'})
    @IsNotEmpty()
    @IsString()
    @IsEnum(['image', 'audio'], {
        message: 'Valid captcha category required'
    })
    category: 'image' | 'audio'
};