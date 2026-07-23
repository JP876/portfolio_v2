import Canvas from '.';
import type { GridOptions } from './types';
import throttle from '../utils/throttle';

type PostionType = { x: number; y: number };

const smallerBoxBy = 12;

class Grid extends Canvas {
  private readonly gridElement = document.createElement('div');
  private positions: PostionType[] = [];
  private columnsCount = 0;
  private rowsCount = 0;
  private boxDimensions = { width: 0, height: 0 };
  private gap = 24;
  private randomGrid: number[] = [];

  constructor(container: HTMLElement, options?: GridOptions) {
    super(container, options);

    if (options?.gap) this.gap = options.gap;
    if (options?.maxRows) this.rowsCount = options.maxRows;

    this.gridElement.className = 'canvas-grid';
    this.gridElement.style.gridTemplateColumns = `
      repeat(auto-fill, minmax(${options?.boxMinWidth ? options.boxMinWidth + 'px' : '60px'}, 1fr))
    `;
    this.gridElement.style.gridTemplateRows = `
      repeat(auto-fill, minmax(${options?.boxMinWidth ? options.boxMinWidth + 'px' : '60px'}, 1fr))
    `;
    this.gridElement.style.gap = `${this.gap}px`;

    this.container?.appendChild(this.gridElement);

    window.addEventListener(
      'resize',
      throttle(() => {
        this.onResize();
        if (options?.onResize) options.onResize();
      }, 200)
    );

    if (this.container) {
      // this.container.addEventListener('mousemove', throttle(this.onMouseMove.bind(this), 200));
      // this.container.addEventListener('mouseleave', this.onMouseLeave.bind(this));
    }
  }

  initGrid() {
    this.generateRandomGrid();
    this.setPositions();
    this.drawGrid();
  }

  private onResize() {
    this.resizeCanvas();
    this.setPositions();
    this.drawGrid();
  }

  private drawInnerBox(x: number, y: number) {
    if (!this.ctx) return null;

    this.ctx.save();
    this.ctx.translate(x, y);

    this.ctx.strokeStyle = 'rgba(0, 128, 255, 0.18)';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(
      smallerBoxBy,
      smallerBoxBy,
      this.boxDimensions.width - smallerBoxBy * 2,
      this.boxDimensions.height - smallerBoxBy * 2
    );
    this.ctx.restore();
  }

  private drawOuterBox(x: number, y: number) {
    if (!this.ctx) return null;

    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)';
    this.ctx.strokeRect(0, 0, this.boxDimensions.width, this.boxDimensions.height);
    this.ctx.restore();
  }

  private generateRandomGrid() {
    for (let i = 0; i < 1_000; i++) {
      this.randomGrid.push(+Math.random().toFixed(2));
    }
  }

  private findBox(x: number, y: number) {
    const rowBellow = this.positions.findIndex((pos) => pos.y > y);
    const index = rowBellow === -1 ? this.positions.length - 1 : rowBellow - 1;
    const row = this.positions.filter((pos) => pos.y === this.positions[index].y);
    return row.find((b) => b.x < x && b.x + this.boxDimensions.width > x && b.y + this.boxDimensions.height > y);
  }

  private setPositions() {
    if (!this.gridElement) return null;

    const styles = window.getComputedStyle(this.gridElement);
    const columns = styles.getPropertyValue('grid-template-columns');
    const rows = styles.getPropertyValue('grid-template-rows');
    const firstRow: PostionType[] = [];

    this.columnsCount = columns.split(' ').length;
    this.rowsCount = this.rowsCount || rows.split(' ').length;

    this.boxDimensions = {
      width: +columns.split(' ')[0].slice(0, -2),
      height: +rows.split(' ')[0].slice(0, -2),
    };
    this.positions = [];

    for (let i = 0; i < this.columnsCount + 1; i++) {
      firstRow.push({
        x: (this.boxDimensions.width + +this.gap) * i - this.boxDimensions.width / 2 - +this.gap / 2,
        y: -this.boxDimensions.height / 2 - +this.gap / 2,
      });
    }

    for (let i = 0; i < this.rowsCount + 1; i++) {
      this.positions.push(
        ...firstRow.map((pos) => ({
          x: pos.x,
          y: i * (this.boxDimensions.height + +this.gap) + pos.y,
        }))
      );
    }
  }

  private drawGrid() {
    if (!this.ctx) return null;

    let pos;

    for (let i = 0; i < this.positions.length; i++) {
      pos = this.positions[i];

      if (this.randomGrid[i] >= 0.44) {
        this.drawOuterBox(pos.x, pos.y);
      }
      if (this.randomGrid[i] >= 0.88) {
        this.drawInnerBox(pos.x, pos.y);
      }
    }
  }
}

export default Grid;
