import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { SplitText } from 'gsap/SplitText';

import { GAP } from './consts';
import RevealText from './RevealText';
import ProjectGallery from './ProjectGallery';

gsap.registerPlugin(ScrollTrigger, Draggable, InertiaPlugin, SplitText);

function initialize() {
  // override CSS to prevent native scrolling
  gsap.set('.carousel', {
    'scroll-snap-type': 'none',
    overflow: 'hidden',
    gap: GAP,
  });
  // display the prev / next buttons
  gsap.set('.carousel-nav', {
    display: 'block',
  });
  // set initial opacity for slides
  gsap.set('.carousel-slide', {
    opacity: (i) => (i === 0 ? 1 : 0.4),
  });
  // new InertiaScroll(true);

  {
    const reveal = new RevealText('#first-project-info', '#first-project-info p', {
      highlightColor: 'rgb(0, 144, 255)',
    });
    reveal.initialize();

    const slides = gsap.utils.toArray<HTMLElement>('#first-project-slide');
    const prev = document.querySelector('#first-prev') as HTMLButtonElement;
    const next = document.querySelector('#first-next') as HTMLButtonElement;
    const container = document.getElementById('first-project-carousel') as HTMLElement;

    const gallery = new ProjectGallery(slides, container, prev, next);
    gallery.initializeGallery();
  }

  {
    const reveal = new RevealText('#second-project-info', '#second-project-info p', {
      highlightColor: 'rgb(0, 255, 30)',
    });
    reveal.initialize();

    const slides = gsap.utils.toArray<HTMLElement>('#second-project-slide');
    const prev = document.querySelector('#second-prev') as HTMLButtonElement;
    const next = document.querySelector('#second-next') as HTMLButtonElement;
    const container = document.getElementById('second-project') as HTMLElement;

    const gallery = new ProjectGallery(slides, container, prev, next);
    gallery.initializeGallery();
  }
}

window.addEventListener('DOMContentLoaded', initialize);
