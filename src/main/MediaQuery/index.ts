import type { Observer, Subject } from '../types';
import type { breakpointType } from './types';

const BREAKPOINTS: breakpointType[] = [
  { name: 'xs', minWidth: 320 },
  { name: 'sm', minWidth: 480 },
  { name: 'md', minWidth: 768 },
  { name: 'lg', minWidth: 1024 },
  { name: 'xl', minWidth: 1280 },
  { name: 'xxl', minWidth: 1560 },
] as const;

class MediaQuery implements Subject {
  currentBreakpoint: breakpointType | null = null;

  private breakpoints = BREAKPOINTS;
  private observers = new Map<string, Observer>();

  constructor() {
    this.currentBreakpoint = this.findNext();
    window.addEventListener('resize', this.onResize.bind(this));
  }

  private onResize() {
    const next = this.findNext();
    if (next.name !== this.currentBreakpoint?.name) {
      this.currentBreakpoint = next;
      this.notify();
    }
  }

  private findNext() {
    let bp = this.breakpoints[0];
    let nextBp = this.breakpoints[1];

    for (let i = 0; i < this.breakpoints.length; i++) {
      bp = this.breakpoints[i];
      nextBp = this.breakpoints[i + 1];

      if (!nextBp || (bp.minWidth < window.innerWidth && nextBp.minWidth > window.innerWidth)) {
        break;
      }
    }

    return bp;
  }

  attach(key: string, observer: Observer) {
    this.observers.set(key, observer);
  }

  detach(key: string) {
    if (this.observers.has(key)) {
      this.observers.delete(key);
    }
  }

  notify() {
    for (const value of this.observers.values()) {
      value.update({ type: 'breakpoint', instance: this });
    }
  }
}

export default MediaQuery;
