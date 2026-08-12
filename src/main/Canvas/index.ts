import type { CanvasOptions } from './types';

class Canvas {
  readonly canvas = document.createElement('canvas');
  readonly ctx: CanvasRenderingContext2D | null = null;
  readonly container: HTMLElement | null = null;

  private resizeElement: HTMLElement | null = null;

  constructor(container: HTMLElement, options?: CanvasOptions) {
    this.container = container;

    this.canvas.width = options?.width || this.container.clientWidth;
    this.canvas.height = options?.height || this.container.clientHeight;

    this.canvas.style.imageRendering = 'pixelated';
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = this.container.clientTop + 'px';
    this.canvas.style.left = this.container.clientLeft + 'px';

    this.ctx = this.canvas.getContext('2d', options?.contextOptions || {});
    this.ctx?.translate(0.5, 0.5);
    this.container.appendChild(this.canvas);

    this.resizeElement = options?.resizeTo ? options.resizeTo : this.container;
  }

  resizeCanvas() {
    if (!this.ctx || !this.resizeElement) return null;

    this.canvas.width = this.resizeElement.clientWidth;
    this.canvas.height = this.resizeElement.clientHeight;
  }

  clearCanvas() {
    if (!this.ctx) return null;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

export default Canvas;
