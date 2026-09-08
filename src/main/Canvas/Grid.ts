import Canvas from '.';
import type { GridOptions } from './types';
import { getRandomFloat, getRandomInt, getRandomNumArray, throttle } from '../utils';
import Settings from '../Settings';

type PostionType = { x: number; y: number };
type BoxPostionsType = {
  all: PostionType[];
  outer: PostionType[];
  inner: PostionType[];
};

const BOXES_RATIO = 0.8;

class Grid extends Canvas {
  private readonly gridElement = document.createElement('div');
  private columnsCount = 0;
  private rowsCount = 0;
  private boxSizes = {
    outer: { width: 0, height: 0 },
    inner: { width: 0, height: 0 },
  };
  private gap = 24;
  private randomGrid: number[][] = [];
  private boxPostions: BoxPostionsType = { outer: [], inner: [], all: [] };

  interval: ReturnType<typeof setTimeout> | null = null;
  colors = { outer: '', inner: '' };

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

    if (Settings.instance.theme) {
      const { secondary, grey } = Settings.instance.theme;
      this.colors = {
        outer: grey[200],
        inner: secondary.extraLight,
      };
    }

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

    if (options?.animate) {
      this.interval = setInterval(() => {
        this.updateInnerGrid();
        this.drawGrid();
      }, options.animate?.timeout || 2_000);
    }
  }

  get boxDimensions() {
    return this.boxSizes;
  }

  findBox(x: number, y: number) {
    const rowBellow = this.boxPostions.all.findIndex((pos) => pos.y > y);
    const index = rowBellow === -1 ? this.boxPostions.all.length - 1 : rowBellow - 1;
    const row = this.boxPostions.all.filter((pos) => pos.y === this.boxPostions.all[index].y);

    return row.find((b) => b.x < x && b.x + this.boxSizes.outer.width > x && b.y + this.boxSizes.outer.height > y);
  }

  initGrid() {
    this.setRowsAndColumns();
    this.generateRandomGrid();
    this.setDimensions();
    this.setPositions();
    this.drawGrid();
  }

  private onResize() {
    this.resizeCanvas();
    this.setRowsAndColumns();
    this.updateRandomGrid();
    this.setDimensions();
    this.setPositions();
    this.drawGrid();
  }

  private drawInnerBox(x: number, y: number) {
    if (!this.ctx) return null;

    this.ctx.save();
    this.ctx.translate(x, y);

    const { width: iW, height: iH } = this.boxSizes.inner;
    const { width: oW, height: oH } = this.boxSizes.outer;

    this.ctx.strokeStyle = this.colors.inner;
    this.ctx.lineWidth = 3.2;
    this.ctx.strokeRect(iW, iH, oW - iW * 2, oH - iH * 2);
    this.ctx.restore();
  }

  private drawOuterBox(x: number, y: number) {
    if (!this.ctx) return null;

    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.strokeStyle = this.colors.outer;
    this.ctx.lineWidth = 1.2;
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
    this.boxPostions = { outer: [], inner: [], all: [] };

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
      this.boxPostions.all.push(
        ...firstRow.map((pos) => ({
          x: pos.x,
          y: i * (this.boxSizes.outer.height + +this.gap) + pos.y,
        }))
      );
    }

    let pos;
    let currentRow = 0;
    let randomNum = 0;

    for (let i = 0; i < this.boxPostions.all.length; i++) {
      if (i > 0 && i % this.columnsCount === 0) {
        currentRow++;
      }

      randomNum = this.randomGrid[currentRow][i % this.columnsCount];
      pos = this.boxPostions.all[i];

      if (randomNum > 5.4) {
        this.boxPostions.outer.push({ x: pos.x, y: pos.y });
      }
      if (randomNum > 8.8) {
        this.boxPostions.inner.push({ x: pos.x, y: pos.y });
      }
    }
  }

  private updateInnerGrid() {
    if (!this.ctx) return null;

    const outer = [...this.boxPostions.outer];

    this.boxPostions.inner.forEach((pos) => {
      this.ctx?.clearRect(pos.x, pos.y, this.boxDimensions.inner.width, this.boxDimensions.inner.height);
    });

    for (let i = 0; i < this.boxPostions.inner.length; i++) {
      const index = getRandomInt(0, outer.length - 1);
      const pos = outer[index];

      if (pos) {
        this.boxPostions.inner[i] = pos;
        this.drawInnerBox(pos.x, pos.y);
        outer.splice(index, 1);
      }
    }
  }

  private drawGrid() {
    if (!this.ctx) return null;

    this.clearCanvas();

    this.boxPostions.outer.forEach((pos) => {
      this.drawOuterBox(pos.x, pos.y);
    });

    this.boxPostions.inner.forEach((pos) => {
      this.drawInnerBox(pos.x, pos.y);
    });
  }
}

export default Grid;
