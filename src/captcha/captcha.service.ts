import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ImageGenService } from 'src/image-gen/image-gen.service';
import { KvstoreService } from 'src/kvstore/kvstore.service';
import { randomUUID } from "crypto"

type ImageCaptcha = {
    id: string,
    image: { width: number, height: number, image: string }
}

@Injectable()
export class CaptchaService {
    private readonly wordSize: number
    private readonly letters: string
    private readonly captchaTTL: number

    constructor(private readonly imageGenService: ImageGenService, private readonly configService: ConfigService, private readonly kvstoreService: KvstoreService) {
        this.wordSize = parseInt(configService.get<number>('CAPTCHA_WORD_SIZE', { infer: true }))
        this.captchaTTL = parseInt(configService.get<number>('CAPTCHA_TTL', { infer: true }))
        this.letters = configService.get<string>('CAPTCHA_LETTERS')
    }

    async generateImageCaptcha(): Promise<ImageCaptcha> {
        let solutionChars: string[] = []
        for (let i = 0; i < this.wordSize; i++) {
            solutionChars.push(this.letters[Math.floor((Math.random() * this.letters.length))])
        }
        const solution = solutionChars.join('')
        const id = randomUUID();
        const image = await this.imageGenService.createChallengeImage(solution)

        await this.kvstoreService.set(id, { solution: solution }, { ttl: this.captchaTTL })

        return { id, image }
    }

    async verifyCaptcha(id: string, solution: string): Promise<boolean> {
        const captcha = await this.kvstoreService.get(id)
        let isCaptchaValid = false
        if (!captcha) {
            return false;
        }
        if (captcha.solution === solution) {
            isCaptchaValid = true;
        }
        // Delete the captcha after it has been used, whether or not the solution is valid
        await this.kvstoreService.delete(id)

        return isCaptchaValid;
    }
}
