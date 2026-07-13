export type CarouselConfigType = {
  repeat?: number;
  paused?: boolean;
  speed?: number;
  snap?: number | boolean;
  paddingRight?: number | string;
  reversed?: boolean;
  center?: boolean | HTMLElement | string;
  onChange?: (el: HTMLElement, index: number) => void;
};
