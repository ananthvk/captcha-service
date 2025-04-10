import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Canvas, createCanvas, CanvasRenderingContext2D } from 'canvas';

const randInt = (l: number, r: number) => Math.floor(Math.random() * (r - l + 1)) + l

@Injectable()
export class ImageGenService {
    private readonly canvasWidth: number
    private readonly canvasHeight: number
    private readonly canvas: Canvas
    private readonly font: string
    private readonly fontSize: number
    private readonly ctx: CanvasRenderingContext2D

    constructor(private readonly configService: ConfigService) {
        this.canvasWidth = parseInt(configService.get<number>('CAPTCHA_WIDTH', { infer: true }))
        this.canvasHeight = parseInt(configService.get<number>('CAPTCHA_HEIGHT', { infer: true }))
        this.canvas = createCanvas(this.canvasWidth, this.canvasHeight);
        this.ctx = this.canvas.getContext('2d')// , { alpha: false })
        this.font = configService.get<string>('CAPTCHA_DEFAULT_FONT')
        this.fontSize = parseInt(configService.get<number>('CAPTCHA_DEFAULT_FONT_SIZE', { infer: true }))
        this.ctx.font = `${this.fontSize}px ${this.font}`
    }

    async createChallengeImage(text: string) {
        // TODO: As an optimization, prepare variants for all letters in the letter set 
        // so that we do not need to rotate/move them each time

        // Fill the background
        this.ctx.fillStyle = "#ffffff"
        this.ctx.globalAlpha = 1
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.ctx.fillStyle = "#1a002e";

        let x = 20
        let Y = Math.floor(this.canvasHeight / 2);
        const numberOfPoints = 20
        const randomPointRadiusMin = 1
        const randomPointRadiusMax = 2

        // Draw character by character
        for (let i = 0; i < text.length; i++) {
            const char = text[i]
            const y = Y + (Math.random() * 10 - 5);
            const rotation = (Math.random() - 0.5) * 0.3;

            this.ctx.save()
            this.ctx.font = `${this.fontSize + Math.floor((Math.random() * 5))}px ${this.font}`
            this.ctx.translate(x, y)
            this.ctx.rotate(rotation)

            x += this.ctx.measureText(char).width
            this.ctx.fillText(char, 0, 0)

            this.ctx.restore()
        }

        this.ctx.fillStyle = "#420075";
        for (let i = 0; i < numberOfPoints; i++) {
            this.ctx.beginPath()
            this.ctx.arc(randInt(0, this.canvasWidth), randInt(0, this.canvasHeight), randInt(randomPointRadiusMin, randomPointRadiusMax), 0, 2 * Math.PI);
            this.ctx.fill();
        }

        /*
        this.ctx.save()
        this.ctx.beginPath();
        this.ctx.moveTo(randInt(0, 20), randInt(0, 20));
        this.ctx.bezierCurveTo(randInt(100, 150), randInt(100, 150), randInt(100, 150), randInt(0, 50), randInt(0, 50), randInt(0, 50));
        this.ctx.stroke()
        this.ctx.restore()

        this.ctx.save()
        this.ctx.beginPath();
        this.ctx.moveTo(randInt(this.canvasWidth - 20, this.canvasWidth), randInt(0, 20));
        this.ctx.bezierCurveTo(randInt(100, 150), randInt(100, 150), randInt(100, 150), randInt(0, 50), randInt(0, 50), randInt(0, 50));
        this.ctx.stroke()
        this.ctx.restore()
        */

        this.ctx.fillStyle = "#1a002e";
        this.ctx.globalAlpha = 0.75

        for (let i = 0; i < 10; i++) {
            const startX = randInt(0, this.canvasWidth / 2)
            const startY = randInt(0, this.canvasHeight / 2)

            const cp1x = randInt(0, this.canvasWidth / 2)
            const cp1y = randInt(0, this.canvasHeight / 2)

            const cp2x = randInt(0, this.canvasWidth)
            const cp2y = randInt(0, this.canvasHeight)

            const x = randInt(this.canvasWidth / 2, this.canvasWidth)
            const y = randInt(0, this.canvasHeight)

            this.ctx.save()
            this.ctx.beginPath();
            this.ctx.moveTo(startX, startY);

            this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
            this.ctx.lineWidth = 1
            this.ctx.setLineDash([randInt(0, 5), randInt(5, 10), randInt(10, 15)])
            this.ctx.stroke()
            this.ctx.restore()
        }


        return { width: this.canvasWidth, height: this.canvasHeight, image: this.canvas.toDataURL() }
    }
}