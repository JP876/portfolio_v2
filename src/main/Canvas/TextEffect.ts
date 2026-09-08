import Canvas from '.';
import type { TextEffectOptions } from './types';
import { throttle } from '../utils';
import { FONT_SIZE } from './consts';
import Particle from './Particle';
import ImageDataToParticles from './ImageDataToParticles';
import TextOptions from './TextOptions';
import LinearGradient from './LinearGradient';
import TextWrap from './TextWrap';
import type { Observer } from '../types';
import MediaQuery from '../MediaQuery';
import type { breakpointNameType } from '../MediaQuery/types';
import Settings from '../Settings';

class TextEffect extends Canvas implements Observer {
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

  private handleFont(breakpoint: breakpointNameType) {
    switch (breakpoint) {
      case 'xs':
      case 'sm':
        this.setOptions = { fontSize: 80, letterSpacing: '2px' };
        break;
      case 'md':
        this.setOptions = { fontSize: 100, letterSpacing: '2px' };
        break;
      default:
        this.setOptions = { fontSize: 120, letterSpacing: '4px' };
    }
  }

  private handleGradient() {
    if (!this.ctx) return null;

    const theme = Settings.instance.theme;
    if (!theme) return null;

    const gradient = [
      { offset: 0.1, color: theme.black },
      { offset: 0.3, color: theme.primary.dark },
      { offset: 0.5, color: theme.primary.main },
      { offset: 0.7, color: theme.primary.dark },
      { offset: 0.9, color: theme.black },
    ];
    this.setOptions = { gradient };
  }

  update(value: { type: string; instance: MediaQuery | Settings }): void {
    if (value.instance instanceof MediaQuery && value.instance.currentBreakpoint?.name) {
      this.handleFont(value.instance.currentBreakpoint.name);
    } else if (
      value.instance instanceof Settings &&
      (this.options.gradient !== null || Array.isArray(this.options.gradient))
    ) {
      this.handleGradient();
    }
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
