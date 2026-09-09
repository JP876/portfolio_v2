import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

const DEFAULT_COLOR = '#a0a0a0'; // grey
const DIV_HIGHLIGHT = '#000000'; // black

export type RevealTextConfig = {
  highlightColor?: string;
  defaultColor?: string;
  revealColor?: string;
  scrollTriggerOptions?: Omit<ScrollTrigger.StaticVars, 'trigger' | 'animation' | 'scrub'>;
};

class RevealText {
  private container: Element | HTMLElement | string | null = null;
  private text: Element | HTMLElement | string | null = null;
  private scrollTrigger: ScrollTrigger | null = null;
  private splitText: SplitText | null = null;
  private tl: GSAPTimeline = gsap.timeline();
  private config: RevealTextConfig = {};

  constructor(
    container: Element | HTMLElement | string,
    text: Element | HTMLElement | string,
    config: RevealTextConfig
  ) {
    this.container = container;
    this.text = text;
    this.config = {
      ...config,
      defaultColor: config?.defaultColor || DEFAULT_COLOR,
      revealColor: config?.revealColor || DIV_HIGHLIGHT,
    };
  }

  set updateConfig(config: RevealTextConfig) {
    this.config = { ...this.config, ...config };
    this.initialize();
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
      start: 'top 100%',
      end: 'bottom 90%',
      ...(this.config?.scrollTriggerOptions || {}),
      scrub: true,
      animation: this.tl,
      trigger: this.container,
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
        gsap.to(char, { color: this.config.revealColor });
      }
    } else {
      gsap.to(char, { color: this.config.defaultColor });
    }
  }
}

export default RevealText;
