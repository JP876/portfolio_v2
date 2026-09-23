import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { SplitText } from 'gsap/SplitText';
import { CSSRulePlugin } from 'gsap/CSSRulePlugin';

import { GAP } from './consts';
import Grid from './Canvas/Grid';
import TextEffect from './Canvas/TextEffect';
import MediaQuery from './MediaQuery';
import Settings from './Settings';
import Project from './Project';

gsap.registerPlugin(ScrollTrigger, Draggable, InertiaPlugin, SplitText, CSSRulePlugin);

// override CSS to prevent native scrolling
gsap.set('.carousel', {
  'scroll-snap-type': 'none',
  overflow: 'hidden',
  gap: GAP,
});

function initialize() {
  const isMobile = 'ontouchstart' in window;
  const mediaQuery = new MediaQuery();

  {
    const buttons = document.querySelectorAll('.button');
    for (const btn of buttons) {
      const spanEl = document.createElement('span');
      btn.appendChild(spanEl);
    }

    const a = document.createElement('a');
    a.href = 'mailto:popovic_josip@protonmail.com';

    const emailBtn = document.getElementById('email-btn') as HTMLButtonElement;
    emailBtn.addEventListener('click', () => {
      a.click();
    });
  }

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
    const projectSections = [
      document.getElementById('first-project-section'),
      document.getElementById('second-project-section'),
      document.getElementById('third-project-section'),
    ];

    for (const section of projectSections) {
      if (section) {
        const project = new Project(section);
        Settings.instance.attach(section.id, project);
        project.init();
      }
    }
  }

  mediaQuery.notify();
  Settings.instance.notify();
}

window.addEventListener('load', initialize, false);
