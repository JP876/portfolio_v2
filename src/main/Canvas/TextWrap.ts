class TextWrap {
  static get(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, text: string, lineHeight: number) {
    let linesCounter = 0;
    let line = '';
    let testLine = '';
    let textPosition = { x: 0, y: 0 };
    const linesArr: string[] = [];
    const words = text.split(' ');

    for (let i = 0; i < words.length; i++) {
      testLine = line + words[i] + ' ';

      if (ctx.measureText(testLine).width > canvas.width) {
        line = words[i] + ' ';
        linesCounter++;
      } else {
        line = testLine;
      }

      linesArr[linesCounter] = line;
    }

    const textHeight = lineHeight * linesCounter;
    textPosition = {
      x: canvas.width / 2,
      y: canvas.height / 2 - textHeight / 2,
    };

    linesArr.forEach((line, index) => {
      ctx?.fillText(line, textPosition.x, textPosition.y + index * lineHeight);
      // ctx?.strokeText(line, textPosition.x, textPosition.y + index * lineHeight);
    });

    return { textPosition };
  }
}

export default TextWrap;
