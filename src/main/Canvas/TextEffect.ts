import Canvas from '.';
import type { TextEffectOptions } from './types';
import { throttle } from '../utils';
import { FONT_SIZE, PARTICLE_SIZE } from './consts';
import Particle from './Particle';

class TextEffect extends Canvas {
  private text = '';
  private readonly options: TextEffectOptions = {};
  private readonly fontSize: number = FONT_SIZE;
  private readonly lineHeight: number = FONT_SIZE * 0.8;

  private particles: Particle[] = [];
  private mouse = { x: 0, y: 0 };
  private imageData: ImageDataArray | null = null;
  private textPostion = { x: 0, y: 0 };

  constructor(container: HTMLElement, options?: TextEffectOptions) {
    super(container, { ...options, contextOptions: { willReadFrequently: true, ...(options?.contextOptions || {}) } });

    this.options = options || {};
    this.fontSize = this.options.fontSize || FONT_SIZE;
    this.lineHeight = this.fontSize * 0.8;

    window.addEventListener(
      'resize',
      throttle(() => {
        this.onResize();
        if (options?.onResize) options.onResize();
      })
    );

    window.addEventListener('mousemove', this.onMouseMove.bind(this));
  }

  private onMouseMove(event: MouseEvent) {
    if (!this.container) return null;
    const { x, y } = this.container.getBoundingClientRect();

    this.mouse.x = Math.abs(event.x - x);
    this.mouse.y = Math.abs(event.y - y);
  }

  private onResize() {
    if (!this.ctx) return null;

    this.resizeCanvas();
    this.setTextOptions();
    this.wrapText(this.text);
    this.imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
    this.convertToParticles();
    this.render();
  }

  init(text: string) {
    if (!this.ctx) return null;
    if (this.options.gradient) this.applyGradient();

    this.text = text;
    this.setTextOptions();
    this.textPostion = {
      x: this.canvas.width / 2,
      y: this.canvas.height / 2,
    };
    this.wrapText(text);
    this.convertToParticles();
    this.render();
  }

  render() {
    this.particles.forEach((particle) => {
      particle.update(this.mouse.x, this.mouse.y);
      particle.draw();
    });
  }

  private convertToParticles() {
    if (!this.ctx) return null;

    this.particles = [];
    this.imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data;

    this.clearCanvas();

    for (let y = 0; y < this.canvas.height; y += PARTICLE_SIZE) {
      for (let x = 0; x < this.canvas.width; x += PARTICLE_SIZE) {
        const index = (y * this.canvas.width + x) * 4;
        const alpha = this.imageData[index + 3];

        if (alpha === 0) continue;

        const r = this.imageData[index + 0];
        const g = this.imageData[index + 1];
        const b = this.imageData[index + 2];
        const color = `rgba(${r},${g},${b},${alpha})`;

        this.particles.push(new Particle(x, y, color, this.ctx));
      }
    }
  }

  private wrapText(text: string) {
    if (!this.ctx) return null;

    let linesCounter = 0;
    let line = '';
    let testLine = '';
    const linesArr: string[] = [];
    const words = text.split(' ');

    for (let i = 0; i < words.length; i++) {
      testLine = line + words[i] + ' ';

      if (this.ctx.measureText(testLine).width > this.canvas.width) {
        line = words[i] + ' ';
        linesCounter++;
      } else {
        line = testLine;
      }

      linesArr[linesCounter] = line;
    }

    const textHeight = this.lineHeight * linesCounter;
    this.textPostion = {
      x: this.canvas.width / 2,
      y: this.canvas.height / 2 - textHeight / 2,
    };

    linesArr.forEach((line, index) => {
      this.ctx?.fillText(line, this.textPostion.x, this.textPostion.y + index * this.lineHeight);
      // this.ctx?.strokeText(line, this.textPostion.x, this.textPostion.y + index * this.lineHeight);
    });
  }

  private applyGradient() {
    if (!this.ctx || !this.options.gradient) return null;

    const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
    for (const stop of this.options.gradient) {
      gradient.addColorStop(stop.offset, stop.color);
    }
    this.ctx.fillStyle = gradient;
  }

  private setTextOptions() {
    if (!this.ctx) return null;

    const fontSize = `${this.fontSize}px`;
    const fontFamily = this.options.fontFamily || 'Helvetica';

    this.ctx.font = `${fontSize} ${fontFamily}`;
    this.ctx.letterSpacing = this.options.letterSpacing || '6px';
    this.ctx.textAlign = this.options.textAlign || 'center';
    this.ctx.textBaseline = this.options.textBaseline || 'middle';

    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 2;
  }
}

export default TextEffect;
