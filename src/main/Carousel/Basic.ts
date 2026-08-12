import gsap from 'gsap';

import CarouselCore from './Core';
import type { CarouselConfigType } from './types';

class CarouselBasic extends CarouselCore {
  readonly slides: HTMLElement[] | null = null;

  private config: CarouselConfigType = {};
  private previousIndex: number | null = null;
  private length: number | null = null;
  private startX: number = 0;
  private widths: number[] = [];
  private xPercents: number[] = [];
  private pixelsPerSecond = 100;
  private spaceBefore: number[] = [];
  private initialContainer: HTMLElement | null = null;

  private snap = (v: number) => v;

  constructor(slides: HTMLElement[], container: HTMLElement, config?: CarouselConfigType) {
    super();

    this.slides = slides;
    this.config = config || {};

    this.length = this.slides.length;
    this.startX = this.slides[0].offsetLeft;
    this.pixelsPerSecond = (this.config.speed || 1) * 100;
    this.snap = this.config.snap === false ? (v: number) => v : gsap.utils.snap(+(this.config.snap || 1));

    this.initialContainer = container;
    this.container =
      this.config.center === true ? container : gsap.utils.toArray<HTMLElement>(this.slides)[0] || container;

    window.addEventListener('resize', () => {
      this.refresh(true);
    });
  }

  set updateConfig(config: CarouselConfigType) {
    this.config = { ...this.config, ...config };

    this.pixelsPerSecond = (this.config.speed || 1) * 100;
    this.snap = this.config.snap === false ? (v: number) => v : gsap.utils.snap(+(this.config.snap || 1));
    this.container =
      this.config.center === true
        ? this.initialContainer
        : gsap.utils.toArray<HTMLElement>(this.slides)[0] || this.initialContainer;

    this.refresh(true);

    if (this.config.onChange && this.slides) {
      this.config.onChange(this.slides[this.activeSlideIndex], this.activeSlideIndex, this.previousIndex);
    }
  }

  private populateOffsets() {
    if (!this.tl || !this.container || !this.totalWidth) {
      return null;
    }

    const timeOffset = this.config.center
      ? (this.tl.duration() * (this.container.offsetWidth / 2)) / this.totalWidth
      : 0;

    if (this.config.center) {
      for (let i = 0; i < this.times.length; i++) {
        const time =
          this.tl.labels['label' + i] + (this.tl.duration() * this.widths[i]) / 2 / this.totalWidth - timeOffset;
        this.times[i] = this.timeWrap(time);
      }
    }
  }

  private initializeTimeline() {
    const onUpdate = () => {
      if (!this.tl || !this.config.onChange || !this.slides) {
        return null;
      }

      const i = this.getClosest(this.times, this.tl.time(), this.tl.duration());
      this.config.onChange(this.slides[i], i, this.previousIndex);

      if (this.previousIndex !== i) {
        this.previousIndex = i;
      }
    };

    const tl = gsap.timeline({
      repeat: this.config.repeat,
      onUpdate: onUpdate,
      paused: this.config.paused,
      defaults: {
        ease: 'none',
      },
      onReverseComplete: () => {
        tl.totalTime(tl.rawTime() + tl.duration() * 100);
      },
    });

    this.tl = tl;
  }

  private getTotalWidth() {
    if (!this.slides || !this.length) {
      return null;
    }

    return (
      this.slides[this.length - 1].offsetLeft +
      (this.xPercents[this.length - 1] / 100) * this.widths[this.length - 1] -
      this.startX +
      this.spaceBefore[0] +
      this.slides[this.length - 1].offsetWidth * +gsap.getProperty(this.slides[this.length - 1], 'scaleX') +
      (parseFloat((this.config.paddingRight || '').toString()) || 0)
    );
  }

  private populateWidths() {
    if (!this.slides || !this.container) {
      return null;
    }

    let b1 = this.container.getBoundingClientRect();
    let b2: DOMRect;

    this.slides.forEach((el: Element, i: number) => {
      this.widths[i] = parseFloat(gsap.getProperty(el, 'width', 'px').toString());
      this.xPercents[i] = this.snap(
        (parseFloat(gsap.getProperty(el, 'x', 'px').toString()) / this.widths[i]) * 100 +
          +gsap.getProperty(el, 'xPercent')
      );

      b2 = el.getBoundingClientRect();
      this.spaceBefore[i] = b2.left - (i ? b1.right : b1.left);
      b1 = b2;
    });

    gsap.set(this.slides, {
      // convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
      xPercent: (i) => this.xPercents[i],
      overwrite: false,
    });

    this.totalWidth = this.getTotalWidth();
  }

  private populateTimeline() {
    if (!this.tl || !this.slides || !this.length) {
      return null;
    }

    let i, item, curX, distanceToStart, distanceToLoop;
    this.tl.clear();

    for (i = 0; i < this.length; i++) {
      item = this.slides[i];
      curX = (this.xPercents[i] / 100) * this.widths[i];
      distanceToStart = item.offsetLeft + curX - this.startX + this.spaceBefore[0];
      distanceToLoop = distanceToStart + this.widths[i] * +gsap.getProperty(item, 'scaleX');

      this.tl
        .to(
          item,
          {
            xPercent: this.snap(((curX - distanceToLoop) / this.widths[i]) * 100),
            duration: distanceToLoop / this.pixelsPerSecond,
            overwrite: false,
          },
          0
        )
        .fromTo(
          item,
          {
            xPercent: this.snap(((curX - distanceToLoop + (this.totalWidth || 0)) / this.widths[i]) * 100),
          },
          {
            xPercent: this.xPercents[i],
            duration: (curX - distanceToLoop + (this.totalWidth || 0) - curX) / this.pixelsPerSecond,
            immediateRender: false,
            overwrite: false,
          },
          distanceToLoop / this.pixelsPerSecond
        )
        .add('label' + i, distanceToStart / this.pixelsPerSecond);
      this.times[i] = distanceToStart / this.pixelsPerSecond;
    }

    this.timeWrap = gsap.utils.wrap(0, this.tl.duration());
  }

  refresh(deep?: boolean) {
    if (!this.tl) {
      return null;
    }

    let progress = this.tl.progress();
    this.tl.progress(0, true);

    this.populateWidths();
    if (deep) {
      this.populateTimeline();
    }
    this.populateOffsets();

    if (deep && this.tl.paused()) {
      this.tl.time(this.times[this.activeSlideIndex], true);
    } else {
      this.tl.progress(progress, true);
    }
  }

  initialize() {
    if (!this.slides || !this.length) {
      return null;
    }

    const imageEl = this.slides[0].firstElementChild as HTMLImageElement;
    console.log(imageEl.src);

    gsap.context(() => {
      this.initializeTimeline();
      gsap.set(this.slides, { x: 0 });

      if (!this.tl) {
        return null;
      }

      this.populateWidths();
      this.populateTimeline();

      this.populateOffsets();

      this.tl.progress(1, true).progress(0, true); // pre-render for performance
      if (this.config.reversed) {
        this.tl.vars.onReverseComplete?.();
        this.tl.reverse();
      }

      if (this.config.onChange && this.slides) {
        this.config.onChange(this.slides[this.activeSlideIndex], this.activeSlideIndex, this.previousIndex);
      }

      this.getClosestIndex(true);
      this.previousIndex = this.activeSlideIndex;
    });
  }

  toIndex(index: number, vars: GSAPTweenVars = {}) {
    if (!this.tl || !this.length) {
      return null;
    }

    if (Math.abs(index - this.activeSlideIndex) > this.length / 2) {
      index += index > this.activeSlideIndex ? -this.length : this.length; // always go in the shortest direction
    }

    const newIndex = gsap.utils.wrap(0, this.length, index);
    let time = this.times[newIndex];

    if (time > this.tl.time() !== index > this.activeSlideIndex && index !== this.activeSlideIndex) {
      // if we're wrapping the timeline's playhead, make the proper adjustments
      vars.modifiers = { time: gsap.utils.wrap(0, this.tl.duration()) };
      time += this.tl.duration() * (index > this.activeSlideIndex ? 1 : -1);
    }

    if (time < 0 || time > this.tl.duration()) {
      vars.modifiers = { time: this.timeWrap };
    }

    this.activeSlideIndex = newIndex;
    vars.overwrite = true;
    gsap.killTweensOf(this.proxy);

    return vars.duration === 0 ? this.tl.time(this.timeWrap(time)) : this.tl.tweenTo(time, vars);
  }

  next(vars: GSAPTweenVars = {}) {
    return this.toIndex((this.activeSlideIndex || 0) + 1, vars);
  }

  previous(vars: GSAPTweenVars = {}) {
    return this.toIndex((this.activeSlideIndex || 0) - 1, vars);
  }
}

export default CarouselBasic;
