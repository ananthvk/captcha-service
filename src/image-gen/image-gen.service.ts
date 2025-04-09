import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Canvas, createCanvas, CanvasRenderingContext2D } from 'canvas';
@Injectable()
export class ImageGenService {
    private readonly canvasWidth: number
    private readonly canvasHeight: number
    private readonly canvas: Canvas
    private readonly ctx: CanvasRenderingContext2D

    constructor(private readonly configService: ConfigService) {
        this.canvasWidth = parseInt(configService.get<number>('CAPTCHA_WIDTH', { infer: true }))
        this.canvasHeight = parseInt(configService.get<number>('CAPTCHA_HEIGHT', { infer: true }))
        this.canvas = createCanvas(this.canvasWidth, this.canvasHeight);
        this.ctx = this.canvas.getContext('2d')
        this.ctx.font = configService.get<string>('CAPTCHA_DEFAULT_FONT')
    }

    async createChallengeImage(text: string) {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.ctx.fillText(text, 0, this.canvasHeight / 2)
        return { width: this.canvasWidth, height: this.canvasHeight, image: this.canvas.toDataURL() }
    }
}