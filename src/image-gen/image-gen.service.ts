import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Canvas, createCanvas, CanvasRenderingContext2D } from 'canvas';


const randInt = (l: number, r: number) => Math.floor(Math.random() * (r - l + 1)) + l
// Captcha security options - Add random noise, arcs, etc
const NUMBER_OF_RANDOM_POINTS = 20
const RANDOM_POINT_MIN_RADIUS = 1
const RANDOM_POINT_MAX_RADIUS = 2

const ARC_OPACITY = 0.59
const ARC_LINE_WIDTH = 2
const ARC_LINE_GET_DASHES = () => [randInt(1, 3), randInt(3, 6), randInt(6, 9)]
const NUMBER_OF_ARCS = 10

const BACKGROUND_COLOR = "#ffffff"
const FILL_COLOR = "#000000"

const TEXT_BASE_X = 20
const TEXT_BASE_Y = (canvasHeight: number) => Math.floor(canvasHeight / 2)
const CHARACTER_ROTATION_MAGNITUDE = 0.3
const CHARACTER_Y_VARIANCE = 10

type Screen = { ctx: CanvasRenderingContext2D, width: number, height: number, font: string, fontSize: number }

const generateRandomPoints = (screen: Screen, numberOfPoints: number, minRadius: number, maxRadius: number) => {
    for (let i = 0; i < numberOfPoints; i++) {
        screen.ctx.beginPath()
        screen.ctx.arc(randInt(0, screen.width), randInt(0, screen.height), randInt(minRadius, maxRadius), 0, 2 * Math.PI);
        screen.ctx.fill();
    }
}

const generateRandomArcs = (screen: Screen, alpha: number, numLines: number) => {
    const prevAlpha = screen.ctx.globalAlpha
    screen.ctx.globalAlpha = alpha
    for (let i = 0; i < numLines; i++) {
        const startX = randInt(0, screen.width / 2)
        const startY = randInt(0, screen.height / 2)

        const cp1x = randInt(0, screen.width / 2)
        const cp1y = randInt(0, screen.height / 2)

        const cp2x = randInt(0, screen.width)
        const cp2y = randInt(0, screen.height)

        const x = randInt(screen.width / 2, screen.width)
        const y = randInt(0, screen.height)

        screen.ctx.save()
        screen.ctx.beginPath();
        screen.ctx.moveTo(startX, startY);

        screen.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
        screen.ctx.lineWidth = ARC_LINE_WIDTH
        screen.ctx.setLineDash(ARC_LINE_GET_DASHES())
        screen.ctx.stroke()
        screen.ctx.restore()
    }
    screen.ctx.globalAlpha = prevAlpha
}

const generateText = (screen: Screen, text: string, baseX: number, baseY: number) => {
    let x = baseX
    // Draw character by character
    for (let i = 0; i < text.length; i++) {
        const char = text[i]
        const y = Math.floor(baseY + (Math.random() * CHARACTER_Y_VARIANCE - (CHARACTER_Y_VARIANCE / 2)));
        const rotation = (Math.random() - 0.5) * CHARACTER_ROTATION_MAGNITUDE;

        screen.ctx.save()
        screen.ctx.font = `${screen.fontSize + Math.floor((Math.random() * 5))}px ${screen.font}`
        screen.ctx.translate(x, y)
        screen.ctx.rotate(rotation)

        x += screen.ctx.measureText(char).width
        screen.ctx.fillText(char, 0, 0)

        screen.ctx.restore()
    }
}
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
        this.ctx.fillStyle = BACKGROUND_COLOR
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.ctx.fillStyle = FILL_COLOR;
        const screen = { ctx: this.ctx, width: this.canvasWidth, height: this.canvasHeight, font: this.font, fontSize: this.fontSize }
        generateText(screen, text, TEXT_BASE_X, TEXT_BASE_Y(this.canvasHeight))
        generateRandomPoints(screen, NUMBER_OF_RANDOM_POINTS, RANDOM_POINT_MIN_RADIUS, RANDOM_POINT_MAX_RADIUS)
        generateRandomArcs(screen, ARC_OPACITY, NUMBER_OF_ARCS)

        return { width: this.canvasWidth, height: this.canvasHeight, image: this.canvas.toDataURL() }
    }
}