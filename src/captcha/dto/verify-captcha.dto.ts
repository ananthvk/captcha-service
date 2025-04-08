import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class VerifyCaptchaDto {
    @IsNotEmpty()
    @IsUUID()
    id: string


    @IsString()
    @IsNotEmpty()
    solution: string
}