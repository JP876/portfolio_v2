import gsap from 'gsap';

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
          start: 'top 92%',
          end: 'bottom 90%',
          // markers: true,
        },
        height: 'calc(100% + 2 * var(--project-border-width))',
        ease: 'power1.in',
      }
    );
  }
}

export default ProjectBorder;
