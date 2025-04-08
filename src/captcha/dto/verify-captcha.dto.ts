import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

@ApiSchema({ name: 'VerifyCaptchaRequest' })
export class VerifyCaptchaDto {
    @ApiProperty({ 'example': '9f93f89a-26ec-4a67-928a-3a61c5ce77a6', description: 'An UUID that represents a captcha that was generated using the generate endpoint.' })
    @IsNotEmpty()
    @IsUUID()
    id: string


    @ApiProperty({ 'example': 'hello', description: 'Captcha solution, solved by the user' })
    @IsString()
    @IsNotEmpty()
    solution: string
}