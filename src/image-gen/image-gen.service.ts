import { Injectable } from '@nestjs/common';
import { createCanvas } from 'canvas';
@Injectable()
export class ImageGenService {
    async createChallengeImage(text: string) {
        // TODO: Store a global canvas instance instead of recreating it each time
        const canvas = createCanvas(200, 100)
        const ctx = canvas.getContext('2d')

        ctx.font = '30px Arial'
        ctx.fillText(text, 100, 50)
        return canvas.toDataURL()
    }
}
