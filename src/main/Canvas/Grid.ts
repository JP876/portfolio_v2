import Canvas from '.';
import type { GridOptions } from './types';
import { getRandomFloat, getRandomNumArray, throttle } from '../utils';

type PostionType = { x: number; y: number };

const BOXES_RATIO = 0.8;

class Grid extends Canvas {
  private readonly gridElement = document.createElement('div');
  private positions: PostionType[] = [];
  private columnsCount = 0;
  private rowsCount = 0;
  private boxSizes = {
    outer: { width: 0, height: 0 },
    inner: { width: 0, height: 0 },
  };
  private gap = 24;
  private randomGrid: number[][] = [];

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
      })
    );

    if (this.container) {
      // this.container.addEventListener('mousemove', throttle(this.onMouseMove.bind(this), 200));
      // this.container.addEventListener('mouseleave', this.onMouseLeave.bind(this));
    }
  }

  get boxDimensions() {
    return this.boxSizes;
  }

  initGrid() {
    this.setRowsAndColumns();
    this.setDimensions();
    this.setPositions();
    this.generateRandomGrid();
    this.drawGrid();
  }

  private onResize() {
    this.resizeCanvas();
    this.setRowsAndColumns();
    this.setDimensions();
    this.setPositions();
    this.updateRandomGrid();
    this.drawGrid();
  }

  private drawInnerBox(x: number, y: number) {
    if (!this.ctx) return null;

    this.ctx.save();
    this.ctx.translate(x, y);

    this.ctx.strokeStyle = 'rgba(0, 128, 255, 0.18)';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(
      this.boxSizes.inner.width,
      this.boxSizes.inner.height,
      this.boxSizes.outer.width - this.boxSizes.inner.width * 2,
      this.boxSizes.outer.height - this.boxSizes.inner.height * 2
    );
    this.ctx.restore();
  }

  private drawOuterBox(x: number, y: number) {
    if (!this.ctx) return null;

    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)';
    this.ctx.strokeRect(0, 0, this.boxSizes.outer.width, this.boxSizes.outer.height);
    this.ctx.restore();
  }

  private updateRandomGrid() {
    if (this.columnsCount > this.randomGrid[0].length) {
      for (let i = 0; i < this.rowsCount; i++) {
        this.randomGrid[i].push(+getRandomFloat(1, 10));
      }
    }
    if (this.rowsCount > this.randomGrid.length) {
      this.randomGrid.push(getRandomNumArray(this.columnsCount, 1, 10));
    }
  }

  private generateRandomGrid() {
    for (let i = 0; i < this.rowsCount; i++) {
      this.randomGrid.push(getRandomNumArray(this.columnsCount, 1, 10));
    }
  }

  findBox(x: number, y: number) {
    const rowBellow = this.positions.findIndex((pos) => pos.y > y);
    const index = rowBellow === -1 ? this.positions.length - 1 : rowBellow - 1;
    const row = this.positions.filter((pos) => pos.y === this.positions[index].y);

    return row.find((b) => b.x < x && b.x + this.boxSizes.outer.width > x && b.y + this.boxSizes.outer.height > y);
  }

  private getColumnsAndRows() {
    const styles = window.getComputedStyle(this.gridElement);
    return {
      columns: styles.getPropertyValue('grid-template-columns'),
      rows: styles.getPropertyValue('grid-template-rows'),
    };
  }

  private setRowsAndColumns() {
    const { columns, rows } = this.getColumnsAndRows();

    // add 1 because of the grid offset
    this.columnsCount = columns.split(' ').length + 1;
    this.rowsCount = this.rowsCount || rows.split(' ').length + 1;
  }

  private setDimensions() {
    const { columns, rows } = this.getColumnsAndRows();

    const width = +Number.parseFloat(columns.split(' ')[0].slice(0, -2)).toFixed(2);
    const height = +Number.parseFloat(rows.split(' ')[0].slice(0, -2)).toFixed(2);

    this.boxSizes = {
      outer: {
        width: width,
        height: height,
      },
      inner: {
        width: width * BOXES_RATIO,
        height: height * BOXES_RATIO,
      },
    };
  }

  private setPositions() {
    this.positions = [];

    const firstRow: PostionType[] = [];
    const offsetX = -this.boxSizes.outer.width / 2 - +this.gap / 2;
    const offsetY = -this.boxSizes.outer.height / 2 - +this.gap / 2;

    for (let i = 0; i < this.columnsCount; i++) {
      firstRow.push({
        x: (this.boxSizes.outer.width + +this.gap) * i + offsetX,
        y: offsetY,
      });
    }

    for (let i = 0; i < this.rowsCount; i++) {
      this.positions.push(
        ...firstRow.map((pos) => ({
          x: pos.x,
          y: i * (this.boxSizes.outer.height + +this.gap) + pos.y,
        }))
      );
    }
  }

  private drawGrid() {
    if (!this.ctx) return null;

    let pos;
    let currentRow = 0;
    let randomNum = 0;

    for (let i = 0; i < this.positions.length; i++) {
      if (i > 0 && i % this.columnsCount === 0) {
        currentRow++;
      }

      randomNum = this.randomGrid[currentRow][i % this.columnsCount];
      pos = this.positions[i];

      if (randomNum > 5.4) {
        this.drawOuterBox(pos.x, pos.y);
      }
      if (randomNum > 8.8) {
        this.drawInnerBox(pos.x, pos.y);
      }
    }
  }
}

export default Grid;
