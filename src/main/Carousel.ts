import gsap from 'gsap';

type CarouselConfigType = {
  repeat?: number;
  paused?: boolean;
  speed?: number;
  snap?: number | false;
  paddingRight?: number;
  reversed?: boolean;
};

class Carousel {
  currentIndex = 0;
  private readonly slides: HTMLDivElement[] | null = null;
  private readonly config: CarouselConfigType = {};

  constructor(slides: HTMLDivElement[], config?: CarouselConfigType) {
    this.slides = slides;
    this.config = config || {};
  }

  initialize() {
    if (!this.slides) {
      return null;
    }

    // overwrite CSS to prevent native scrolling
    gsap.set('.carousel', { 'scroll-snap-type': 'none' });
    // display the prev / next buttons and progress text
    gsap.set('.carousel-nav', { display: 'block' });

    this.slides.forEach((slide, i) => {
      slide.classList.add('carousel-slide-abs');
      gsap.set(slide, { opacity: i === 0 ? 1 : 0 });
    });
  }

  updateSlide(direction: 'next' | 'prev') {
    if (!this.slides) {
      return null;
    }
    // current slide's outro
    gsap.to(this.slides[this.currentIndex], { opacity: 0, ease: 'power3' });

    this.currentIndex = gsap.utils.wrap(
      0,
      this.slides.length,
      (this.currentIndex += direction === 'next' ? 1 : -1)
    );
    // new current slide's intro
    gsap.to(this.slides[this.currentIndex], {
      opacity: 1,
      ease: 'power3.inOut',
    });
  }
}

export default Carousel;
