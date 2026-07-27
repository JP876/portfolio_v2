export type CanvasOptions = {
  width?: number;
  height?: number;
  resizeTo?: HTMLElement;
};

export type GridOptions = CanvasOptions & {
  boxMinWidth?: number;
  gap?: number;
  maxRows?: number;
  offset?: (() => { x: number; y: number }) | null;
  onResize?: () => void;
};
