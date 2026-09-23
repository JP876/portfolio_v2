import ProjectGallery from './Gallery';
import RevealText from '../RevealText';
import ProjectBorder from './Border';
import Settings from '../Settings';
import type { Observer, Subject } from '../types';

class Project implements Observer {
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
      const prev = this.#container.querySelector('.carousel-nav [data-type="prev"]') as HTMLButtonElement;
      const next = this.#container.querySelector('.carousel-nav [data-type="next"]') as HTMLButtonElement;
      const progress = this.#container.querySelector('.carousel-progress') as SVGElement;

      this.#gallery = new ProjectGallery([...slides], container, prev, next, progress);
      this.#gallery.initializeGallery();
    }
  }

  update(_: { type: string; instance: Subject }): void {}
}

export default Project;
