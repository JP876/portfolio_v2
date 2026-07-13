import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Carousel from './Carousel';

gsap.registerPlugin(ScrollTrigger);

const slides = gsap.utils.toArray<HTMLDivElement>('.carousel-slide');
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');

const firstProjectCarousel = new Carousel(slides);
firstProjectCarousel.initialize();

if (next && prev) {
  next.addEventListener('click', () => {
    firstProjectCarousel.updateSlide('next');
  });
  prev.addEventListener('click', () => {
    firstProjectCarousel.updateSlide('prev');
  });
}
