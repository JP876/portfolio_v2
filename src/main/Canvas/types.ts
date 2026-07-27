export type CanvasOptions = {
  width?: number;
  height?: number;
  resizeTo?: HTMLElement;
  contextOptions?: CanvasRenderingContext2DSettings;
};

export type GridOptions = CanvasOptions & {
  boxMinWidth?: number;
  gap?: number;
  maxRows?: number;
  offset?: (() => { x: number; y: number }) | null;
  onResize?: () => void;
};

export type GradientType = {
  offset: number;
  color: string;
};

export type TextEffectOptions = CanvasOptions & {
  fontSize?: number;
  fontFamily?: string;
  letterSpacing?: string;
  textAlign?: CanvasTextAlign;
  textBaseline?: CanvasTextBaseline;
  gradient?: GradientType[] | null;
  onResize?: () => void;
};
