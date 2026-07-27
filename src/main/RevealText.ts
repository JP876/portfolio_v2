import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

const DEFAULT_COLOR = '#a0a0a0'; // grey
const DIV_HIGHLIGHT = '#000000'; // black

export type RevealTextConfig = {
  highlightColor?: string;
};

class RevealText {
  private container: HTMLElement | string | null = null;
  private text: HTMLElement | string | null = null;
  private scrollTrigger: ScrollTrigger | null = null;
  private splitText: SplitText | null = null;
  private tl: GSAPTimeline = gsap.timeline();
  private config: RevealTextConfig = {};

  constructor(container: HTMLElement | string, text: HTMLElement | string, config: RevealTextConfig) {
    this.container = container;
    this.text = text;
    this.config = config;
  }

  initialize() {
    if (!this.container || !this.text) {
      return null;
    }

    this.splitText = SplitText.create(this.text, {
      type: 'chars',
      smartWrap: true,
    });

    this.splitText.chars.forEach((word, index) => {
      this.tl.call(this.animateWord.bind(this), [word], index + 0.01);
    });
    this.tl.set({}, {}, '+=0.01');

    this.scrollTrigger = ScrollTrigger.create({
      trigger: this.container,
      start: 'top 80%',
      end: 'center 60%',
      scrub: true,
      animation: this.tl,
    });
  }

  private animateWord(char: Element) {
    if (!this.scrollTrigger) {
      return null;
    }

    if (this.scrollTrigger.direction === 1) {
      if (char.parentElement?.parentElement?.id === 'highlight') {
        gsap.to(char, { color: this.config.highlightColor });
      } else {
        gsap.to(char, { color: DIV_HIGHLIGHT });
      }
    } else {
      gsap.to(char, { color: DEFAULT_COLOR });
    }
  }
}

export default RevealText;
