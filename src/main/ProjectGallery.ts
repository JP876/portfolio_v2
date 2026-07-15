import gsap from 'gsap';

import { GAP } from './consts';
import CarouselDraggable from './Carousel/Draggable';

const ACTIVE_DASH_WIDTH = 4;
const DEFAULT_DASH_WIDTH = 1;
const DASH_GAP = 4;

class ProjectGallery extends CarouselDraggable {
  private activeSlide: HTMLElement | null = null;
  private readonly prevBtn: HTMLButtonElement | null = null;
  private readonly nextBtn: HTMLButtonElement | null = null;
  private readonly progressSVG: SVGElement | null = null;
  private readonly progressPath: SVGPathElement | null = null;
  private pathWidth: number | null = null;

  constructor(
    slides: HTMLElement[],
    container: HTMLElement,
    prevBtn: HTMLButtonElement,
    nextBtn: HTMLButtonElement,
    progress: SVGElement
  ) {
    super(slides, container, {});
    this.updateConfig = {
      paused: true, // TODO: bug with false, animation stops earlier
      paddingRight: GAP,
      center: true,
      onChange: (slide, index, previousIndex) => {
        if (previousIndex !== index) {
          if (this.activeSlide) {
            gsap.to('.active', { opacity: 0.4 });
            this.activeSlide.classList.remove('active');
          }

          slide.classList.add('active');
          this.activeSlide = slide;
          gsap.to('.active', { opacity: 1, ease: 'power2.inOut' });

          this.updateProgress(index);
        }
      },
    };

    this.prevBtn = prevBtn;
    this.nextBtn = nextBtn;
    this.progressSVG = progress;

    this.pathWidth = (slides.length - 1) * (DEFAULT_DASH_WIDTH + DASH_GAP) + ACTIVE_DASH_WIDTH;
    this.progressPath = this.progressSVG.getElementsByTagName('path')[0];

    this.updateProgress(0, 0);
  }

  private updateProgress(index: number, duration?: number) {
    if (!this.slides || !this.progressPath) {
      return null;
    }

    let str = '';
    for (let i = 0; i < this.slides.length; i++) {
      str += i == index ? ACTIVE_DASH_WIDTH : DEFAULT_DASH_WIDTH;
      str += ' ' + DASH_GAP + ' ';
    }

    gsap.to(this.progressPath, {
      duration: duration ?? 0.5,
      attr: {
        'stroke-dasharray': str,
        stroke: 'black',
      },
    });
  }

  initializeGallery() {
    this.initialize();
    this.initializeDraggable();

    this.toIndex(0, { duration: 0 });

    gsap.set(this.progressSVG, {
      attr: { viewBox: '-1 -1 ' + (this.pathWidth || 0 + 2) + ' 2' },
    });
    gsap.set(this.progressPath, {
      attr: { d: 'M0,0 ' + this.pathWidth + ',0' },
      cursor: 'pointer',
    });

    if (this.slides) {
      this.slides.forEach((slide, i) => {
        slide.addEventListener('click', () => this.toIndex(i, { duration: 1, ease: 'expo' }));
      });
    }

    this.initializeEvents();
  }

  private initializeEvents() {
    if (!this.prevBtn || !this.nextBtn || !this.progressPath) {
      return null;
    }

    this.nextBtn.addEventListener('pointerover', this.onBtnPointerOver);
    this.nextBtn.addEventListener('pointerout', this.onBtnPointerOut);
    this.nextBtn.addEventListener('click', this.onNextBtnClick.bind(this));

    this.prevBtn.addEventListener('pointerover', this.onBtnPointerOver);
    this.prevBtn.addEventListener('pointerout', this.onBtnPointerOut);
    this.prevBtn.addEventListener('click', this.onPrevBtnClick.bind(this));

    this.progressPath.addEventListener('click', this.onProgressDotClick.bind(this));
  }

  private onNextBtnClick() {
    this.next({ duration: 1, ease: 'expo' });
  }

  private onPrevBtnClick() {
    this.previous({ duration: 1, ease: 'expo' });
  }

  private onBtnPointerOver(event: PointerEvent) {
    gsap.to(event.target, { opacity: 0.4 });
  }

  private onBtnPointerOut(event: PointerEvent) {
    gsap.to(event.target, { opacity: 1 });
  }

  private onProgressDotClick(event: PointerEvent) {
    if (!(event.target instanceof SVGPathElement) || !this.slides || !this.pathWidth) {
      return null;
    }

    // TODO: needs better solution
    const rect = event.target.getBoundingClientRect();
    const percentage = ((event.x - rect.x) / rect.width) * 100;
    const index = Math.floor(percentage / (100 / this.slides.length));

    if (this.activeSlideIndex !== index) {
      this.toIndex(index, { duration: 1, ease: 'expo' });
    }
  }
}

export default ProjectGallery;
