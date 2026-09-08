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

    const btn = document.getElementById('email-btn') as HTMLButtonElement;
    btn.addEventListener('click', async () => {
      copyToClipboard('popovic_josip@protonmail.com');
    });
  }

  {
    const projectSection = document.getElementById('first-project-section') as HTMLElement;

    const border = new ProjectBorder(projectSection);
    border.init();

    const projectGrid = new Grid(projectSection, { resizeTo: projectSection, maxRows: 1 });

    projectGrid.initGrid();
    projectGrid.canvas.style.zIndex = '-1';

    const descriptionEl = projectSection.querySelector('.project-description') as HTMLElement;
    const description = new RevealText(descriptionEl.parentElement!, descriptionEl, {
      highlightColor: Settings.instance.theme.primary.main,
    });
    description.initialize();

    const slides = gsap.utils.toArray<HTMLElement>(projectSection.querySelectorAll('.carousel-slide'));
    const container = projectSection.querySelector('.carousel') as HTMLElement;
    const prev = projectSection.querySelector('[data-type="prev"]') as HTMLButtonElement;
    const next = projectSection.querySelector('[data-type="next"]') as HTMLButtonElement;
    const progress = projectSection.querySelector('.carousel-progress') as SVGElement;

    const gallery = new ProjectGallery(slides, container, prev, next, progress);
    gallery.initializeGallery();
  }

  {
    const description = new RevealText('#second-project-info', '#second-project-info p', {
      highlightColor: 'rgb(0, 255, 30)',
    });
    description.initialize();

    const slides = gsap.utils.toArray<HTMLElement>('#second-project-slide');
    const prev = document.querySelector('#second-prev') as HTMLButtonElement;
    const next = document.querySelector('#second-next') as HTMLButtonElement;
    const container = document.getElementById('second-project') as HTMLElement;
    const progress = document.querySelector('#second-project-carousel-progress') as SVGElement;

    const gallery = new ProjectGallery(slides, container, prev, next, progress);
    gallery.initializeGallery();
  }

  mediaQuery.notify();
  Settings.instance.notify();
}

window.addEventListener('load', initialize, false);
