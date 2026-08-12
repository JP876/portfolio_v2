import Canvas from '.';
import type { TextEffectOptions } from './types';
import { throttle } from '../utils';
import { FONT_SIZE } from './consts';
import Particle from './Particle';
import ImageDataToParticles from './ImageDataToParticles';
import TextOptions from './TextOptions';
import LinearGradient from './LinearGradient';
import TextWrap from './TextWrap';

class TextEffect extends Canvas {
  private text = '';
  private options: TextEffectOptions = {};
  private fontSize: number = FONT_SIZE;
  private lineHeight: number = FONT_SIZE * 0.92;

  private particles: Particle[] = [];
  private mouse = { x: 0, y: 0 };
  private imageData: ImageDataArray | null = null;

  constructor(container: HTMLElement, text: string, options?: TextEffectOptions) {
    super(container, { ...options, contextOptions: { willReadFrequently: true, ...(options?.contextOptions || {}) } });

    this.text = text;
    this.options = options || {};
    this.fontSize = this.options.fontSize || FONT_SIZE;
    this.lineHeight = this.fontSize * 0.92;

    window.addEventListener(
      'resize',
      throttle(() => {
        this.onResize();
        if (options?.onResize) options.onResize();
      })
    );

    window.addEventListener(
      'mousemove',
      throttle((event: MouseEvent) => {
        this.onMouseMove(event);
      }, 50)
    );
  }

  public set setOptions(options: TextEffectOptions) {
    this.options = { ...this.options, ...options };
    this.fontSize = this.options.fontSize || FONT_SIZE;
    this.lineHeight = this.fontSize * 0.92;

    this.clearCanvas();
    this.resizeCanvas();
    this.init();
  }

  private onMouseMove(event: MouseEvent) {
    if (!this.container) return null;
    const { x, y, width, height } = this.container.getBoundingClientRect();

    // check if mouse position is outside of the container/canvas
    if (event.x > x && event.x < x + width && event.y > y && event.y < y + height) {
      this.mouse = { x: event.x - x, y: event.y - y };
    } else {
      this.mouse = { x: 0, y: 0 };
    }
  }

  private onResize() {
    if (!this.ctx) return null;

    this.resizeCanvas();
    this.init();
  }

  init() {
    if (!this.ctx) return null;
    if (this.options.gradient) {
      this.ctx.fillStyle = LinearGradient.get(this.canvas, this.ctx, this.options.gradient);
    }

    TextOptions.set(this.ctx, { fontSize: this.fontSize, ...this.options });
    TextWrap.get(this.canvas, this.ctx, this.text, this.lineHeight);

    this.convertToParticles();
    this.render();
  }

  render() {
    this.clearCanvas();
    this.particles.forEach((particle) => {
      particle.update(this.mouse.x, this.mouse.y);
      particle.draw();
    });
  }

  private convertToParticles() {
    if (!this.ctx) return null;

    this.imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
    this.clearCanvas();
    this.particles = ImageDataToParticles.get(this.canvas, this.ctx, this.imageData);
  }
}

export default TextEffect;
