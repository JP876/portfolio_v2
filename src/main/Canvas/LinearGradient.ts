import type { GradientType } from './types';

class LinearGradient {
  static get(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, gradient: GradientType[] = []) {
    const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    for (const stop of gradient) {
      g.addColorStop(stop.offset, stop.color);
    }
    return g;
  }
}

export default LinearGradient;
