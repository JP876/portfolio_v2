import gsap from 'gsap';

import { getRandomInt } from '../utils';

export type TUnderlineOptions = {
  overflowX?: number;
  moveY?: number;
  curveX?: number;
  curveY?: number;
  endY?: number;
};

const DEFAULT_OPTIONS = {
  overflowX: 40,
};

class Underline {
  #parentEl: HTMLElement | null = null;
  #canvas = document.createElement('canvas');
  #ctx = this.#canvas.getContext('2d')!;
  #svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  #path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  #textWidth: number = 0;
  #options: TUnderlineOptions = {};
  #pathDOptions = { moveY: 0, curveX: 0, curveY: 0, endY: 0 };

  constructor(parentEl: HTMLElement, options?: TUnderlineOptions) {
    this.#parentEl = parentEl;
    this.#options = options || {};

    this.#pathDOptions = {
      moveY: this.#options?.moveY ?? getRandomInt(5, 10),
      curveX: this.#options?.curveX ?? getRandomInt(40, 80),
      curveY: this.#options?.curveY ?? getRandomInt(-5, 5),
      endY: this.#options?.endY ?? getRandomInt(5, 15),
    };

    this.#svg.setAttribute('height', '30');
    this.#svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    this.update();
    this.#path.setAttribute('fill', 'transparent');
    this.#path.setAttribute('stroke', 'black');
    this.#path.setAttribute('stroke-width', '3');
    this.#path.setAttribute('stroke-linecap', 'round');
    this.#svg.appendChild(this.#path);

    this.#parentEl.appendChild(this.#svg);
    this.#handleResize();
  }

  get path() {
    return this.#path;
  }

  get svg() {
    return this.#svg;
  }

  #setTextWidth() {
    const inputText = this.#parentEl!.innerText;

    const fontSize = gsap.getProperty(this.#parentEl, 'font-size', 'px');
    const fontFamily = gsap.getProperty(this.#parentEl, 'font-family');
    const font = `${fontSize} ${fontFamily}`;

    this.#ctx.font = font;
    this.#textWidth = +this.#ctx.measureText(inputText).width.toFixed(2);
  }

  getPathD() {
    const { moveY, curveX, curveY, endY } = this.#pathDOptions;
    const w = this.#textWidth + (this.#options?.overflowX ?? DEFAULT_OPTIONS.overflowX);
    return `M0 ${moveY} Q ${curveX} ${curveY} ${w} ${endY}`;
  }

  #handleResize() {
    const observer = new ResizeObserver((_) => {
      this.update();
    });
    observer.observe(this.#parentEl!);
  }

  update() {
    this.#setTextWidth();
    this.#svg.setAttribute(
      'width',
      (this.#textWidth + (this.#options?.overflowX ?? DEFAULT_OPTIONS.overflowX)).toString()
    );
    this.#path.setAttribute('d', this.getPathD());
  }
}

export default Underline;
