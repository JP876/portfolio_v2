import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

class InertiaScroll {
  private touchOnly = !!('ontouchstart' in window);

  constructor(disable?: boolean) {
    if (this.touchOnly || disable) {
      gsap.set('.main', { position: 'absolute' });
      gsap.set('.scroller', { display: 'none' });
    } else {
      window.addEventListener('resize', this.updateScrollerHeight);
      this.updateScrollerHeight();

      ScrollTrigger.create({
        trigger: '.scroller',
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: () => {
          gsap.to('.main', { y: -window.scrollY });
        },
      });
    }
  }

  private updateScrollerHeight() {
    gsap.set('.scroller', { height: gsap.getProperty('.main', 'height') });
  }
}

export default InertiaScroll;
