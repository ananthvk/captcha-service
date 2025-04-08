import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { IsBase64, IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";

@ApiSchema({ name: 'GenerateCaptchaResponse' })
export class GenerateCaptchaResponseDto {
    @ApiProperty({ example: '9f93f89a-26ec-4a67-928a-3a61c5ce77a6' })
    @IsUUID()
    @IsString()
    @IsNotEmpty()
    id: string

    @ApiProperty({ example: 'image' })
    @IsNotEmpty()
    @IsString()
    category: 'image' | 'audio'

    @ApiProperty({ example: 'aGVsbG8gd29ybGQsIHRoaXMgaX....' })
    @IsString()
    @IsBase64()
    image: string

    @ApiProperty({ example: 200 })
    @IsNumber()
    width: number

    @ApiProperty({ example: 100 })
    @IsNumber()
    height: number
};