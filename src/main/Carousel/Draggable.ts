import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

import type { CarouselConfigType } from './types';
import CarouselBasic from './Basic';

class CarouselDraggable extends CarouselBasic {
  draggable: Draggable | null = null;
  private wrap = gsap.utils.wrap(0, 1);
  private ratio: number = 1;
  private startProgress: number = 0;
  private lastSnap: number = 0;
  private initChangeX: number = 0;
  private wasPlaying: boolean = false;

  constructor(slides: HTMLElement[], container: HTMLElement, config?: CarouselConfigType) {
    super(slides, container, config);
    if (typeof gsap.plugins.inertia === 'undefined') {
      console.warn('InertiaPlugin required for momentum-based scrolling and snapping.');
    }

    this.proxy = document.createElement('div');
  }

  private align() {
    if (!this.tl || !this.draggable) {
      return null;
    }
    const tl = this.tl.progress(
      this.wrap(this.startProgress + (this.draggable.startX - this.draggable.x) * this.ratio)
    );
    return tl;
  }

  private syncIndex() {
    return this.getClosestIndex(true);
  }

  initializeDraggable() {
    if (!this.slides || !this.container || !this.tl) {
      return null;
    }

    gsap.context(() => {
      const self = this;
      const trigger = (this.slides ? this.slides[0].parentNode : this.container) as HTMLElement;

      const draggable = Draggable.create(this.proxy, {
        trigger,
        type: 'x',
        onDrag() {
          self.align();
        },
        onThrowUpdate() {
          self.align();
        },
        overshootTolerance: 0,
        inertia: true,
        onPressInit() {
          gsap.killTweensOf(self.tl);

          self.wasPlaying = !self.tl?.paused();
          self.tl?.pause();
          self.startProgress = self.tl?.progress() ?? 0;
          self.refresh();
          self.ratio = 1 / (self.totalWidth ?? 1);
          self.initChangeX = self.startProgress / -self.ratio - this.x;

          gsap.set(self.proxy, { x: self.startProgress / -self.ratio });
        },
        onRelease() {
          self.syncIndex();
          if (draggable.isThrowing) {
            self.indexIsDirty = true;
          }
        },
        onThrowComplete() {
          self.syncIndex();
          if (self.wasPlaying && self.tl) {
            self.tl.play();
          }
        },
        snap(value) {
          // note: if the user presses and releases in the middle of a throw, due to the sudden correction of
          // proxy.x in the onPressInit(), the velocity could be very large, throwing off the snap.
          // So sense that condition and adjust for it. We also need to set overshootTolerance to 0 to prevent
          // the inertia from causing it to shoot past and come back
          if (Math.abs(self.startProgress / -self.ratio - this.x) < 10) {
            return self.lastSnap + self.initChangeX;
          }

          const duration = self.tl?.duration() ?? 1;
          const time = -(value * self.ratio) * duration;
          const wrappedTime = self.timeWrap(time);

          const snapTime = self.times[self.getClosest(self.times, wrappedTime, duration)];
          let dif = snapTime - wrappedTime;

          if (Math.abs(dif) > duration / 2) {
            dif += dif < 0 ? duration : -duration;
          }

          self.lastSnap = (time + dif) / duration / -self.ratio;
          return self.lastSnap;
        },
      })[0];

      this.draggable = draggable;
    });
  }
}

export default CarouselDraggable;
