import type { TextOptionsType } from './types';

class TextOptions {
  static set(ctx: CanvasRenderingContext2D, options: TextOptionsType = {}) {
    const fontSize = `${options.fontSize}px`;
    const fontFamily = options.fontFamily || 'Helvetica';

    ctx.font = `${fontSize} ${fontFamily}`;
    ctx.letterSpacing = options.letterSpacing || '4px';
    ctx.textAlign = options.textAlign || 'center';
    ctx.textBaseline = options.textBaseline || 'middle';

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
  }
}

export default TextOptions;
