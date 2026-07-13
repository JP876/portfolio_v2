import gsap from 'gsap';

import { GAP } from './consts';
import DraggableCarousel from './DraggableCarousel';

class ProjectGallery extends DraggableCarousel {
  private activeSlide: HTMLElement | null = null;
  private readonly prevBtn: HTMLButtonElement | null = null;
  private readonly nextBtn: HTMLButtonElement | null = null;

  constructor(slides: HTMLElement[], container: HTMLElement, prevBtn: HTMLButtonElement, nextBtn: HTMLButtonElement) {
    super(slides, container, {});
    this.updateConfig = {
      paused: true,
      paddingRight: GAP,
      center: true,
      onChange: (slide) => {
        if (this.activeSlide) {
          gsap.to('.active', { opacity: 0.4 });
          this.activeSlide.classList.remove('active');
        }

        slide.classList.add('active');
        this.activeSlide = slide;
        gsap.to('.active', { opacity: 1, ease: 'power2.inOut' });
      },
    };

    this.prevBtn = prevBtn;
    this.nextBtn = nextBtn;
  }

  initializeGallery() {
    this.initialize();
    this.initializeDraggable();

    this.toIndex(0, { duration: 0 });
    if (this.slides) {
      this.slides.forEach((slide, i) => {
        slide.addEventListener('click', () => this.toIndex(i, { duration: 1, ease: 'expo' }));
      });
    }

    this.initializeEvents();
  }

  private initializeEvents() {
    if (!this.prevBtn || !this.nextBtn) {
      return null;
    }

    this.nextBtn.addEventListener('pointerover', this.arrowBtnOver);
    this.nextBtn.addEventListener('pointerout', this.arrowBtnOut);
    this.nextBtn.addEventListener('click', () => this.next({ duration: 1, ease: 'expo' }));

    this.prevBtn.addEventListener('pointerover', this.arrowBtnOver);
    this.prevBtn.addEventListener('pointerout', this.arrowBtnOut);
    this.prevBtn.addEventListener('click', () => this.previous({ duration: 1, ease: 'expo' }));
  }

  private arrowBtnOver(e: PointerEvent) {
    gsap.to(e.target, { opacity: 0.4 });
  }

  private arrowBtnOut(e: PointerEvent) {
    gsap.to(e.target, { opacity: 1 });
  }
}

export default ProjectGallery;
