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
  animate?: { timeout?: number };
  offset?: (() => { x: number; y: number }) | null;
  onResize?: () => void;
};

export type GradientType = {
  offset: number;
  color: string;
};

export type TextOptionsType = {
  fontSize?: number;
  fontFamily?: string;
  letterSpacing?: string;
  textAlign?: CanvasTextAlign;
  textBaseline?: CanvasTextBaseline;
};

export type TextEffectOptions = CanvasOptions &
  TextOptionsType & {
    gradient?: GradientType[] | null;
    particleOptions?: {};
    onResize?: () => void;
  };
