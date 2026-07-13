import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

import { DEFAULT_COLOR, DIV_HIGHLIGHT } from './consts';

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
      type: 'words',
    });

    this.splitText.words.forEach((word, index) => {
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

  private animateWord(word: Element) {
    if (!this.scrollTrigger) {
      return null;
    }

    if (this.scrollTrigger.direction === 1) {
      if (word?.parentElement?.nodeName == 'P') {
        gsap.to(word, { color: DIV_HIGHLIGHT });
      } else {
        gsap.to(word, { color: this.config.highlightColor });
      }
    } else {
      gsap.to(word, { color: DEFAULT_COLOR });
    }
  }
}

export default RevealText;
