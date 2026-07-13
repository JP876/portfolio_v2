import gsap from 'gsap';

class CarouselCore {
  private currentIndex = 0;
  private timeline: GSAPTimeline | null = null;

  times: number[] = []; // the time it takes for each item to reach the "start" position
  indexIsDirty = false;
  totalWidth: number | null = null;
  container: HTMLElement | null = null;
  proxy: HTMLElement | null = null;

  timeWrap: ReturnType<typeof gsap.utils.wrap<number>> = (i: number) => i;

  constructor() {}

  get tl() {
    if (!this.timeline) return null;
    return this.timeline;
  }

  set tl(timeline: GSAPTimeline | null) {
    this.timeline = timeline;
  }

  get activeSlideIndex() {
    return (this.indexIsDirty ? this.getClosestIndex(true) : this.currentIndex) || 0;
  }

  set activeSlideIndex(index: number) {
    this.currentIndex = index;
  }

  getClosest(values: number[], value: number, wrap: number) {
    let i = values.length;
    let closest = 1e10;
    let index = 0;
    let d;

    while (i--) {
      d = Math.abs(values[i] - value);
      if (d > wrap / 2) {
        d = wrap - d;
      }
      if (d < closest) {
        closest = d;
        index = i;
      }
    }
    return index;
  }

  getClosestIndex(setCurrent?: boolean) {
    if (!this.timeline) {
      return null;
    }

    const index = this.getClosest(this.times, this.timeline.time(), this.timeline.duration());
    if (setCurrent) {
      this.currentIndex = index;
      this.indexIsDirty = false;
    }
    return index;
  }
}

export default CarouselCore;
