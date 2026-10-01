import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

export type RevealTextConfig = {
  highlightColor?: string;
  defaultColor?: string;
  revealColor?: string;
  scrollTriggerOptions?: Omit<ScrollTrigger.StaticVars, 'trigger' | 'animation' | 'scrub'>;
};

class RevealText {
  private container: HTMLElement | null = null;
  private text: HTMLElement | null = null;
  private textStyles: CSSStyleDeclaration | null = null;
  private scrollTrigger: ScrollTrigger | null = null;
  private splitText: SplitText | null = null;
  private tl: GSAPTimeline = gsap.timeline();
  private config: RevealTextConfig = {};

  constructor(container: HTMLElement, text: HTMLElement, config?: RevealTextConfig) {
    this.container = container;
    this.text = text;
    this.textStyles = getComputedStyle(this.text);
    this.setDefaultConfig(config);
  }

  set updateConfig(config: RevealTextConfig) {
    this.config = { ...this.config, ...config };
    this.initialize();
  }

  private setDefaultConfig(config?: RevealTextConfig) {
    if (!this.textStyles) {
      return null;
    }
    this.config = {
      ...config,
      highlightColor:
        config?.highlightColor || this.textStyles.getPropertyValue('--project-description-highlight-color'),
      defaultColor: config?.defaultColor || this.textStyles.getPropertyValue('--project-description-default-color'),
      revealColor: config?.revealColor || this.textStyles.getPropertyValue('--project-description-reveal-color'),
    };
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
    this.tl.set({}, {}, '+=0.1');

    this.scrollTrigger = ScrollTrigger.create({
      start: 'top 98%',
      end: 'bottom 90%',
      ...(this.config?.scrollTriggerOptions || {}),
      scrub: true,
      animation: this.tl,
      trigger: this.container,
      // markers: true,
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
