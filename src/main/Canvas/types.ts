export type CanvasOptions = {
  width?: number;
  height?: number;
  resizeTo?: HTMLElement;
};

export type GridOptions = CanvasOptions & {
  boxMinWidth?: number;
  gap?: number;
  maxRows?: number;
  offset?: (dimmensions: { width: number; height: number }) => { x: number; y: number };
  onResize?: () => void;
};
