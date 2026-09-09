import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { SplitText } from 'gsap/SplitText';
import { CSSRulePlugin } from 'gsap/CSSRulePlugin';

import { GAP } from './consts';
import RevealText from './RevealText';
import ProjectGallery from './ProjectGallery';
import Grid from './Canvas/Grid';
import TextEffect from './Canvas/TextEffect';
import { copyToClipboard } from './utils';
import MediaQuery from './MediaQuery';
import Settings from './Settings';

gsap.registerPlugin(ScrollTrigger, Draggable, InertiaPlugin, SplitText, CSSRulePlugin);

class ProjectBorder {
  #container: HTMLElement | null = null;

  constructor(container: HTMLElement) {
    this.#container = container;
  }

  init() {
    if (!this.#container) {
      return null;
    }

    const border = document.createElement('div');
    border.classList.add('project-border');
    this.#container.appendChild(border);

    gsap.fromTo(
      border,
      { height: '0%' },
      {
        scrollTrigger: {
          trigger: this.#container,
          scrub: true,
          start: 'top 84%',
          end: 'bottom 72%',
          // markers: true,
        },
        height: 'calc(100% + 2 * 2px)',
        ease: 'power1.in',
      }
    );
  }
}

class Project {
  #container: HTMLElement | null = null;
  #border: ProjectBorder | null = null;
  #description: RevealText | null = null;
  #gallery: ProjectGallery | null = null;

  constructor(container: HTMLElement) {
    this.#container = container;
  }

  init() {
    if (!this.#container) return null;

    this.#border = new ProjectBorder(this.#container);
    this.#border.init();

    const descriptionEl = this.#container.querySelector('.project-description') as HTMLElement;
    this.#description = new RevealText(descriptionEl.parentElement!, descriptionEl, {
      highlightColor: Settings.instance.theme.primary.main,
    });
    this.#description.initialize();

    const container = this.#container.querySelector<HTMLElement>('.carousel');
    const slides = this.#container.querySelectorAll<HTMLElement>('.carousel-slide');

    if (container && slides.length > 0) {
      const prev = this.#container.querySelector('[data-type="prev"]') as HTMLButtonElement;
      const next = this.#container.querySelector('[data-type="next"]') as HTMLButtonElement;
      const progress = this.#container.querySelector('.carousel-progress') as SVGElement;

      this.#gallery = new ProjectGallery([...slides], container, prev, next, progress);
      this.#gallery.initializeGallery();
    }
  }
}

function initialize() {
  // override CSS to prevent native scrolling
  gsap.set('.carousel', {
    'scroll-snap-type': 'none',
    overflow: 'hidden',
    gap: GAP,
  });
  // display the prev / next buttons
  gsap.set('.carousel-nav, .carousel-progress', {
    display: 'block',
  });
  // set initial opacity for slides
  gsap.set('.carousel-slide', {
    opacity: (i) => (i === 0 ? 1 : 0.4),
  });

  const isMobile = 'ontouchstart' in window;
  const mediaQuery = new MediaQuery();

  const emailBtn = document.getElementById('email-btn') as HTMLButtonElement;
  emailBtn.addEventListener('click', async () => {
    copyToClipboard('popovic_josip@protonmail.com');
  });

  // new InertiaScroll(true);
  {
    const heroSection = document.getElementById('hero-section') as HTMLElement;
    const heroGrid = new Grid(heroSection, { animate: {} });

    heroGrid.initGrid();
    heroGrid.canvas.style.zIndex = '-10';

    const author = new TextEffect(document.getElementById('dev') as HTMLElement, 'Josip Popović', {
      fontFamily: Settings.instance.theme.fontFamily.heading,
    });

    author.init();
    mediaQuery.attach('dev', author);
    Settings.instance.attach('dev', author);

    if (!isMobile) {
      function animate() {
        author.render();
        requestAnimationFrame(animate);
      }
      animate();
    }

    // gsap.from('.hero-description p', { stagger: 0.2, x: '-100%' });
  }

  {
    const projectSection = document.getElementById('first-project-section') as HTMLElement;
    const project = new Project(projectSection);
    project.init();
  }

  {
    const contactSection = document.querySelector<HTMLElement>('.contact')!;

    const contactGrid = new Grid(contactSection, { animate: {} });
    contactGrid.initGrid();
    contactGrid.canvas.style.zIndex = '-10';
  }

  mediaQuery.notify();
  Settings.instance.notify();
}

window.addEventListener('load', initialize, false);
