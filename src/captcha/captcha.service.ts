import { Injectable } from '@nestjs/common';
import { ImageGenService } from 'src/image-gen/image-gen.service';

const chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const wordSize = 5

@Injectable()
export class CaptchaService {
    constructor(private readonly imageGenService: ImageGenService) {
    }

    async generateCaptcha() {
        let word = ''
        for (let i = 0; i < wordSize; i++) {
            word = word + chars[Math.floor((Math.random() * chars.length))]
        }
        return this.imageGenService.createChallengeImage(word)
    }

    async verifyCaptcha() {
    }
}
