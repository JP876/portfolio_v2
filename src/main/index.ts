import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { SplitText } from 'gsap/SplitText';

import { GAP } from './consts';
import RevealText from './RevealText';
import ProjectGallery from './ProjectGallery';
import Grid from './Canvas/Grid';
import TextEffect from './Canvas/TextEffect';

gsap.registerPlugin(ScrollTrigger, Draggable, InertiaPlugin, SplitText);

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

  // new InertiaScroll(true);
  {
    const heroSection = document.getElementById('hero-section') as HTMLElement;
    const heroGrid = new Grid(heroSection);

    heroGrid.initGrid();

    const author = new TextEffect(document.getElementById('dev') as HTMLElement, {});
    author.init('Josip Popović');

    function animate() {
      author.render();
      requestAnimationFrame(animate);
    }
    animate();
  }

  {
    const projectSection = document.getElementById('first-project-section') as HTMLElement;
    const container = document.getElementById('first-project-carousel') as HTMLElement;
    const carouselSection = container.parentElement as HTMLElement;

    function handleResize() {
      const carouselRect = carouselSection.getBoundingClientRect();
      const containerRect = projectSection.getBoundingClientRect();

      const x = carouselRect.x - containerRect.x;
      const y = carouselRect.y - containerRect.y;

      projectGrid.ctx?.clearRect(x, y, carouselRect.width, carouselRect.height);
    }

    const projectGrid = new Grid(projectSection, { resizeTo: projectSection, onResize: handleResize, maxRows: 2 });

    projectGrid.initGrid();
    projectGrid.canvas.style.zIndex = '-1';

    handleResize();

    const description = new RevealText('#first-project-info', '#first-project-info p', {
      highlightColor: 'rgb(0, 144, 255)',
    });
    description.initialize();

    const slides = gsap.utils.toArray<HTMLElement>('#first-project-slide');
    const prev = document.querySelector('#first-prev') as HTMLButtonElement;
    const next = document.querySelector('#first-next') as HTMLButtonElement;
    const progress = document.querySelector('#first-project-carousel-progress') as SVGElement;

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
}

window.addEventListener('load', initialize, false);
